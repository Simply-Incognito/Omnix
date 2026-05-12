"use strict"
const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

const Store = require(`${__dirname}/../models/Store`);
const Order = require(`${__dirname}/../models/Order`);
const User = require(`${__dirname}/../models/User`);

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
            $project: {
                _id: 0,
                storeName: 1,
                totalAmount: 1
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        },
        {
            $sort: { totalRevenue: -1 }
        }
    ]);

    console.log(revenueStats)



    const storeNames = await Store.find().select("storeName");

    console.log(storeNames)

    const revenueWithNames = revenueStats.map(r => ({
        _id: storeNames.find(s => s.storeName === r.storeName),
        totalRevenue: r.totalRevenue
    }));

    console.log(revenueWithNames)

    res.status(200).json({
        status: "success",
        data: { revenueWithNames }
    });
});