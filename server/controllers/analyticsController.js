"use strict"
const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

const Store = require(`${__dirname}/../models/Store`);
const Order = require(`${__dirname}/../models/Order`);
const User = require(`${__dirname}/../models/User`);
const Product = require(`${__dirname}/../models/Product`);

// - Write Mongoose aggregations to calculate:
//      - Total revenue per store.
//      - Top-selling products.
//      - New customer signups this month.

//  ----------------- SUPER_ADMIN ONLY --------------------------  //
exports.getTotalRevenuePerStore = asyncErrorHandler(async (req, res, next) => {

    const revenueStats = await Order.aggregate([
        {
            $match: {
                status: "pending"
            }
        },
        {
            $lookup: {
                from: "stores",
                localField: "storeId",
                foreignField: "_id",
                as: "storeInfo"
            }
        },
        {
            $project: {
                _id: 1,
                storeId: 1,
                totalAmount: 1,
                items: 1
            }
        },
        {
            $group: {
                _id: "$storeId",
                totalRevenue: { $sum: "$totalAmount" }
            }
        },
        {
            $sort: {
                totalRevenue: 1
            }
        }
    ]);

    const storeNames = await Store.find().select("storeName");


    const revenueWithNames = revenueStats.map(r => ({
        _id: (storeNames.find(s => (s._id).equals(r._id)))._id,
        totalRevenue: r.totalRevenue
    }));

    res.status(200).json({
        status: "success",
        data: { revenueWithNames }
    });
});


exports.getTopSellingProducts = asyncErrorHandler(async (req, res, next) => {

    const topProducts = await Order.aggregate([
        {
            $match: {
                status: "pending"
            }
        }, {
            $unwind: "$items"
        },
        {
            $project: {
                _id: "$items.productId",
                quantity: "$items.quantity"
            }
        },
        {
            $group: {
                _id: "$_id",
                totalQuanity: {
                    $sum: "$quantity"
                }
            }
        },
        {
            $sort: {
                totalQuanity: -1
            }
        },
        {
            $limit: 10 // Return best 10 top products
        }
    ]);

    const productNames = await Product.find().select('name');

    const topProductsWithName = topProducts.map(p => ({
        _id: productNames.find(n => (p._id).equals(n._id))._id,
        productName: productNames.find(n => (p._id).equals(n._id)).name,
        totalQuantitySold: p.totalQuanity
    }))

    console.log(topProductsWithName)

    res.status(200).json({
        status: 'success',
        data: { topProductsWithName }
    })

});

exports.getNewCustomerSignupsThisMonth = asyncErrorHandler(async (req, res, next) => {
    // 1. Get the first day of the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const stats = await User.aggregate([
        {
            $match: {
                role: 'customer',
                createdAt: { $gte: startOfMonth }
            }
        },
        {
            $group: {
                _id: null,
                totalSignups: { $sum: 1 }
            }
        }
    ]);

    const signupCount = stats.length > 0 ? stats[0].totalSignups : 0;

    res.status(200).json({
        status: 'success',
        data: {
            newCustomerSignups: signupCount,
            month: startOfMonth.toLocaleString('default', { month: 'long' })
        }
    });
});


// ----------------- VENDOR ONLY --------------------------  //

exports.getVendorRevenue = asyncErrorHandler(async (req, res, next) => {

    const storeId = req.storeId;

    const revenue = await Order.aggregate([
        {
            $match: {
                storeId: storeId,
                status: "pending"
            }
        },
        {
            $group: {
                _id: storeId,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    res.status(200).json({
        success: true,
        data: { totalRevenue }
    });
});


exports.getVendorTopSellingProducts = asyncErrorHandler(async (req, res, next) => {

    const storeId = req.storeId;

    const topProducts = await Order.aggregate([
        {
            $match: {
                storeId: storeId,
                status: "pending"
            }
        }, {
            $unwind: "$items"
        },
        {
            $project: {
                _id: "$items.productId",
                quantity: "$items.quantity"
            }
        },
        {
            $group: {
                _id: "$_id",
                totalQuanity: {
                    $sum: "$quantity"
                }
            }
        },
        {
            $sort: {
                totalQuanity: -1
            }
        },
        {
            $limit: 10
        }
    ]);

    const productNames = await Product.find().select('name');

    const topProductsWithName = topProducts.map(p => ({
        _id: productNames.find(n => (p._id).equals(n._id))._id,
        productName: productNames.find(n => (p._id).equals(n._id)).name,
        totalQuantitySold: p.totalQuanity
    }))

    res.status(200).json({
        status: 'success',
        data: { topProductsWithName }
    })
});

exports.getNewStoreCustomerSignupsThisMonth = asyncErrorHandler(async (req, res, next) => {
    const storeId = req.storeId;

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const stats = await User.aggregate([
        {
            $match: {
                role: 'customer',
                storeId: storeId,
                createdAt: { $gte: startOfMonth }
            }
        },
        {
            $group: {
                _id: null,
                totalSignups: { $sum: 1 }
            }
        }
    ]);

    const signupCount = stats.length > 0 ? stats[0].totalSignups : 0;

    res.status(200).json({
        status: 'success',
        data: {
            newCustomerSignups: signupCount,
            month: startOfMonth.toLocaleString('default', { month: 'long' })
        }
    });
});