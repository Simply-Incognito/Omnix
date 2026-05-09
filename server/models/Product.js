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
        type: String,
        required: [true, 'Please provide a category.'],
        enum: {
            values: ['Electronics', 'Clothing', 'Home Goods', 'Beauty', 'Sports', 'Toys', 'Books', 'Other'],
            message: '{VALUE} is not a valid category.'
        },
        default: 'Other'
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

// Prevent duplicate product names WITHIN THE SAME STORE
productSchema.index({ storeId: 1, name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;