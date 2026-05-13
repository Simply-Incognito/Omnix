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
    
});