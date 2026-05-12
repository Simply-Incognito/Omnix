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
                status: "Delivered"
            }
        },
        {
            $group: {
                _id: "$store",
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);



});