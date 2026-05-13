"use strict";

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

const Store = require(`${__dirname}/../models/Store`);
const User = require(`${__dirname}/../models/User`);

// Become a Vendor
exports.addVendor = asyncErrorHandler(async (req, res, next) => {
    // storename, optionalsettings

    // 1. Create the store
    const store = await Store.create({
        storeName: req.body.storeName,
        owner: req.user.id,
        settings: req.body.settings
    });

    // 2. Upgrade the user's role to vendor_admin!
    const user = await User.findById(req.user.id);
    user.role = 'vendor_admin';
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
        status: 'success',
        message: "Congratulations, you are now a store owner!",
        data: {
            store
        }
    });
});

// Add Staff(Vendor)
exports.addStaff = asyncErrorHandler(async (req, res, next) => {
    // req.body -> email
    // Find the user the vendor wants to hire by email
    const employee = await User.findOne({ email: req.body.email });

    if (!employee) {
        return next(new AppError("User not found!", 404));
    }

    // Change role to staff and link them to the store
    employee.role = 'staff';
    employee.employedAtStoreId = req.storeId; // Injected by tenant.js middleware!
    await employee.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Staff member added successfully.'
    });

});


// View Vendor Store (super_admin, vendor_admin)
exports.getStores = asyncErrorHandler(async (req, res, next) => {
    let filteredStores;

    if (req.user.role === 'vendor_admin') filteredStores = await Store.find({ owner: req.user.id });

    if (req.user.role === 'staff') filteredStores = await Store.find({ _id: req.user.employedAtStoreId });

    if (req.user.role === 'customer') filteredStores = await Store.find({ status: 'active' })
        .select('storeName slug settings.themeColor products'); // Only return safe, public fields

    if (req.user.role === 'super_admin') filteredStores = await Store.find();


    res.status(200).json({
        success: true,
        data: {
            count: filteredStores.length,
            stores: filteredStores
        }
    });
});

// Get Store Product
exports.getStoreProducts = asyncErrorHandler(async (req, res, next) => {

});

// Edit or Update Store
exports.updateStore = asyncErrorHandler(async (req, res, next) => {
    // req.body -> storeName, settings

    const store = await Store.findByIdAndUpdate(req.storeId, req.body, {
        new: true,
        runValidators: true
    });

    if (!store) {
        return next(new AppError("Store not found!", 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Store updated successfully!',
        data: {
            store
        }
    });
});

// Get vendor store details for store admin
exports.getMyStore = asyncErrorHandler(async (req, res, next) => {
    // Only owner or admin can access (req.user is available because we passed authMiddleware before tenantMiddleware)
    const store = await Store.findById(req.storeId);

    if (!store) {
        return next(new AppError("Store not found!", 404));
    }

    if (req.user.id != store.owner) {
        return next(new AppError("You are not authorized to access this store!", 403));
    }
    res.status(200).json({
        status: 'success',
        data: {
            store
        }
    });
});

// Delete (de-activate store) by Admin/Owner
exports.deactivateStore = asyncErrorHandler(async (req, res, next) => {
    const store = await Store.findByIdAndUpdate(req.storeId, { status: 'inactive' }, {
        new: true,
        runValidators: true
    });

    if (!store) {
        return next(new AppError("Store not found!", 404));
    }

    return res.status(204).json({
        status: 'success',
        data: null
    });
});

// Store Analytics (super_admin, vendor_admin)
exports.storeAnalytics = asyncErrorHandler(async (req, res, next) => {
    const stats = await Product.aggregate([
        {
            $match: { storeId: req.storeId }
        },
        {
            $group: {
                _id: '$storeId',
                totalProducts: { $sum: 1 },
                totalStock: { $sum: '$stockQuantity' },
                totalRevenue: { $sum: { $multiply: ['$price', '$stockQuantity'] } }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});