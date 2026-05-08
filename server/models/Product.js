"use strict";

const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, "Store is required!"]
    },
    name: {
        type: String,
        required: [true, "Please provide a name."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please provide a description."],
        trim: true
    },
    photo: {
        type: String
    },
    price: {
        type: Number,
        required: [true, "Please provide a price."]
    },
    stockQuantity: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category.']
    },
    ratingsAverage: {
        type: Number,
        default: 4.0,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    priceDiscount: {
        type: Number,
        default: 0
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;