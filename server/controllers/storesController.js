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

exports.getStores = asyncErrorHandler(async (req, res, next) => {
    let filteredStores;

    // Only vendor_admin can see their own store
    if (req.user.role === 'vendor_admin') {
        filteredStores = await Store.find({ owner: req.user.id });
    }

    // Super_admin can see all stores
    if (req.user.role === 'super_admin') {
        filteredStores = await Store.find();
    }

    res.status(200).json({
        success: true,
        data: {
            filteredStores
        }
    });
});