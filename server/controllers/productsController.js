"use strict";

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

const Product = require(`${__dirname}/../models/Product`);
const Store = require(`${__dirname}/../models/Store`);


const filterReqObj = (allowedFields, reqObj) => {
    const fields = Object.keys(reqObj);
    const filteredReqObj = {};

    fields.map(field => {
        if (allowedFields.includes(field)) {
            filteredReqObj[field] = reqObj[field];
        }
    });

    return filteredReqObj;
}

exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find().populate('storeId');

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products }
    });
});

exports.getStoreProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find({ storeId: req.storeId });

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products }
    });
});

exports.getProductById = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError("Product not found!", 404));
    }

    res.status(200).json({
        status: 'success',
        data: { product }
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

// Update Product (vendor_admin, super_admin)
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    const filteredReqObj = filterReqObj(
        ["name", "description", "photo", "price", "stockQuantity", "category", "priceDiscount"],
        req.body
    );

    let product;

    if (req.user.role === 'vendor_admin') {
        product = await Product.findOne({ storeId: req.storeId, _id: req.params.id });
    } else if (req.user.role === 'super_admin') {
        product = await Product.findById(req.params.id);
    }

    if (!product) {
        return next(new AppError("Product not found!", 404));
    }

    Object.assign(product, filteredReqObj);
    await product.save();

    res.status(200).json({
        status: 'success',
        message: "Product updated successfully.",
        data: { product }
    });
});

// Delete Product(vendor_admin + super_admin)
exports.deleteProductById = asyncErrorHandler(async (req, res, next) => {
    let product;

    if (req.user.role === 'vendor_admin') {
        product = await Product.findOne({ storeId: req.storeId, _id: req.params.id });
    } else if (req.user.role === 'super_admin') {
        product = await Product.findById(req.params.id);
    }

    if (!product) {
        return next(new AppError("Product not found!", 404));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        message: "Product deleted!",
        data: null
    });
});
