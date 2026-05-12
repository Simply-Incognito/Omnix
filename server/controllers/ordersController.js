"use strict";

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

const Order = require(`${__dirname}/../models/Order`);
const Product = require(`${__dirname}/../models/Product`);
const Store = require(`${__dirname}/../models/Store`);


// ─── STATUSES CONSIDERED "PAST" FOR CUSTOMERS ───────────────────────────────
const PAST_ORDER_STATUSES = ['delivered', 'cancelled'];

// ─── STATUSES STAFF ARE ALLOWED TO SET (processing flow) ─────────────────────
const STAFF_ALLOWED_STATUSES = ['processing', 'shipped'];

// ─── STATUSES VENDOR_ADMIN ARE ALLOWED TO SET ────────────────────────────────
const VENDOR_ALLOWED_STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];


// ─── Get the store IDs owned by a vendor_admin ───────────────────────────
const getOwnedStoreIds = async (userId) => {
    const stores = await Store.find({ owner: userId }).select('_id');
    return stores.map(s => s._id);
};


// ════════════════════════════════════════════════════════════════════════════════
// GET ALL ORDERS  (role-scoped)
// ════════════════════════════════════════════════════════════════════════════════
exports.getOrders = asyncErrorHandler(async (req, res, next) => {
    const { role, id: userId, employedAtStoreId } = req.user;

    let query = {};

    if (role === 'super_admin') {
        // No filter – see everything
        query = {};

    } else if (role === 'vendor_admin') {
        // Only orders in stores they own
        const storeIds = await getOwnedStoreIds(userId);
        if (storeIds.length === 0) {
            return res.status(200).json({ status: 'success', results: 0, data: [] });
        }
        query = { storeId: { $in: storeIds } };

    } else if (role === 'staff') {
        // Only orders in the store they are employed at
        if (!employedAtStoreId) {
            return next(new AppError('You are not assigned to any store.', 403));
        }
        query = { storeId: employedAtStoreId };

    } else if (role === 'customer') {
        // Only their own completed/cancelled orders
        query = {
            customerId: userId,
            status: { $in: PAST_ORDER_STATUSES }
        };

    } else {
        return next(new AppError('You are not allowed to view orders.', 403));
    }

    const orders = await Order.find(query)
        .populate('storeId', 'storeName slug')
        .populate('customerId', 'firstname lastname email')
        .populate('items.productId', 'name price');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders
    });
});


// ════════════════════════════════════════════════════════════════════════════════
// GET SINGLE ORDER  (role-scoped)
// ════════════════════════════════════════════════════════════════════════════════
exports.getOrder = asyncErrorHandler(async (req, res, next) => {
    const { role, id: userId, employedAtStoreId } = req.user;

    const order = await Order.findById(req.params.id)
        .populate('storeId', 'storeName slug')
        .populate('customerId', 'firstname lastname email')
        .populate('items.productId', 'name price');

    if (!order) {
        return next(new AppError('Order not found.', 404));
    }

    if (role === 'super_admin') {
        // Full access

    } else if (role === 'vendor_admin') {
        const storeIds = await getOwnedStoreIds(userId);
        const belongs = storeIds.some(id => id.equals(order.storeId._id));
        if (!belongs) return next(new AppError('You do not have access to this order.', 403));

    } else if (role === 'staff') {
        if (!employedAtStoreId || !employedAtStoreId.equals(order.storeId._id)) {
            return next(new AppError('You do not have access to this order.', 403));
        }

    } else if (role === 'customer') {
        const isOwner = order.customerId._id.equals(userId);
        const isPast = PAST_ORDER_STATUSES.includes(order.status);
        if (!isOwner || !isPast) {
            return next(new AppError('You do not have access to this order.', 403));
        }

    } else {
        return next(new AppError('You are not allowed to view this order.', 403));
    }

    res.status(200).json({ status: 'success', data: order });
});


// ════════════════════════════════════════════════════════════════════════════════
// UPDATE ORDER STATUS
//   • vendor_admin  → can set: processing | shipped | delivered | cancelled
//   • staff         → can set: processing | shipped  (process the order)
// ════════════════════════════════════════════════════════════════════════════════
exports.updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
    const { role, id: userId, employedAtStoreId } = req.user;
    const { status } = req.body;

    if (!status) {
        return next(new AppError('Please provide a status to update.', 400));
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError('Order not found.', 404));
    }

    if (role === 'vendor_admin') {
        // Confirm the order belongs to one of their stores
        const storeIds = await getOwnedStoreIds(userId);
        const belongs = storeIds.some(id => id.equals(order.storeId));
        if (!belongs) return next(new AppError('You do not have access to this order.', 403));

        if (!VENDOR_ALLOWED_STATUSES.includes(status)) {
            return next(new AppError(`vendor_admin can only set status to: ${VENDOR_ALLOWED_STATUSES.join(', ')}.`, 400));
        }

    } else if (role === 'staff') {
        // Confirm the order belongs to their store
        if (!employedAtStoreId || !employedAtStoreId.equals(order.storeId)) {
            return next(new AppError('You do not have access to this order.', 403));
        }

        if (!STAFF_ALLOWED_STATUSES.includes(status)) {
            return next(new AppError(`Staff can only set status to: ${STAFF_ALLOWED_STATUSES.join(', ')}.`, 400));
        }

    } else {
        return next(new AppError('You are not allowed to update order status.', 403));
    }

    order.status = status;
    await order.save();

    res.status(200).json({ status: 'success', data: order });
});


// ════════════════════════════════════════════════════════════════════════════════
// CREATE ORDER  (customers only)
// ════════════════════════════════════════════════════════════════════════════════
exports.createOrder = asyncErrorHandler(async (req, res, next) => {
    const customerId = req.user.id;

    const { storeId, items } = req.body;



    if (!items || !Array.isArray(items) || items.length === 0) {
        return next(new AppError('Please provide at least one item.', 400));
    }

    // Check if products exist and belong to the requested store
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
            return next(new AppError('Product not found!', 404));
        }
        if (product.storeId.toString() !== storeId.toString()) {
            return next(new AppError('Product does not belong to this store!', 400));
        }

        // Check if product is in stock
        if (product.quantity < item.quantity) {
            return next(new AppError(`${product.name} is out of stock!`, 400));
        }
        // Decrease product quantity
        product.quantity -= item.quantity;
        await product.save();
        item.price = product.price; // capture price at time of order
    }

    const order = await Order.create({
        storeId,
        customerId,
        items,
        totalAmount: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        status: 'pending',
        orderDate: new Date()
    });

    res.status(201).json({
        status: 'success',
        data: order
    });
});

// ════════════════════════════════════════════════════════════════════════════════
// UPDATE ORDER  (full control for vendor_admin and super_admin)
// ════════════════════════════════════════════════════════════════════════════════
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
    const { role, id: userId, employedAtStoreId } = req.user;

    if (!['super_admin', 'vendor_admin'].includes(role)) {
        return next(new AppError('You are not allowed to update orders.', 403));
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new AppError('Order not found.', 404));
    }

    if (role === 'vendor_admin') {
        const storeIds = await getOwnedStoreIds(userId);
        const belongs = storeIds.some(id => id.equals(order.storeId));
        if (!belongs) return next(new AppError('You do not have access to this order.', 403));
    }

    // Allow admin to update ANY field via the body
    Object.assign(order, req.body);
    await order.save();

    res.status(200).json({ status: 'success', data: order });
});


// ════════════════════════════════════════════════════════════════════════════════
// DELETE ORDER  (super_admin only)
// ════════════════════════════════════════════════════════════════════════════════
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
    const { role } = req.user;

    if (role !== 'super_admin') {
        return next(new AppError('You are not allowed to delete orders.', 403));
    }

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        return next(new AppError('Order not found.', 404));
    }

    res.status(204).json({ status: 'success', data: null });
});
