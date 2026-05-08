"use strict";

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

const Product = require(`${__dirname}/../models/Product`);

exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
    // Because of tenant.js, req.storeId is guaranteed to be correct here!
    // This will ONLY return products for that specific vendor.
    const products = await Product.find({ storeId: req.storeId });

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products }
    });
});

exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    // We automatically force the storeId onto the new product
    // The vendor cannot manually pass a fake storeId in the body!
    const newProduct = await Product.create({
        ...req.body,
        storeId: req.storeId 
    });

    res.status(201).json({
        success: true,
        data: { product: newProduct }
    });
});
