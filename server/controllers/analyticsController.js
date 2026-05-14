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
            $match: { status: "delivered" }
        },
        {
            $group: {
                _id: "$storeId",
                totalRevenue: { $sum: "$totalAmount" }
            }
        },
        {
            $lookup: {
                from: "stores",
                localField: "_id",
                foreignField: "_id",
                as: "storeInfo"
            }
        },
        {
            $unwind: "$storeInfo"
        },
        {
            $project: {
                _id: 1,
                totalRevenue: 1,
                storeName: "$storeInfo.storeName"
            }
        },
        {
            $sort: { totalRevenue: -1 }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: { revenueStats }
    });
});


exports.getTopSellingProducts = asyncErrorHandler(async (req, res, next) => {
    const topProducts = await Order.aggregate([
        {
            $match: { status: "delivered" }
        },
        {
            $unwind: "$items"
        },
        {
            $group: {
                _id: "$items.productId",
                totalQuantitySold: { $sum: "$items.quantity" }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        {
            $unwind: "$productInfo"
        },
        {
            $project: {
                _id: 1,
                totalQuantitySold: 1,
                productName: "$productInfo.name"
            }
        },
        {
            $sort: { totalQuantitySold: -1 }
        },
        {
            $limit: 10
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: { topProducts }
    });
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

exports.getPlatformOverview = asyncErrorHandler(async (req, res, next) => {

    const totalRevenue = await Order.aggregate([
        {
            $match: {
                status: "delivered"
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const totalOrders = await Order.countDocuments({ status: "delivered" });

    const totalCustomers = await User.countDocuments({ role: "customer" });

    const totalVendors = await User.countDocuments({ role: "vendor" });

    const totalStores = await Store.countDocuments({});

    res.status(200).json({
        status: 'success',
        data: {
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
            totalOrders,
            totalCustomers,
            totalVendors,
            totalStores
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
                status: "delivered"
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
                status: "delivered"
            }
        },
        {
            $unwind: "$items"
        },
        {
            $group: {
                _id: "$items.productId",
                totalQuantitySold: { $sum: "$items.quantity" }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        {
            $unwind: "$productInfo"
        },
        {
            $project: {
                _id: 1,
                totalQuantitySold: 1,
                productName: "$productInfo.name"
            }
        },
        {
            $sort: { totalQuantitySold: -1 }
        },
        {
            $limit: 10
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: { topProducts }
    });
});
