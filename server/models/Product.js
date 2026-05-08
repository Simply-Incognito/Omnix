"use strict";

const mongoose = require('mongoose');


const productModel = mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, "Store is required!"]
    },
    title: {
        type: String,
        required: [true, "Please provide a title."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please provide a description."],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please provide a price."]
    },
    inventory: {
        type: Number,
        default: 0
    }
});

const Product = mongoose.model('Product', productModel);

module.exports = Product;