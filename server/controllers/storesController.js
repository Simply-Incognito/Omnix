"use strict";

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

const Store = require(`${__dirname}/../models/Store`);

exports.addVendor = asyncErrorHandler(async (req, res, next) => {
    // storename, optionalsettings
    const store = await Store.create({
        storeName: req.body.storeName,
        owner: req.user.id,
        settings: req.body.settings
    });

    res.status(201).json({
        success: true,
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