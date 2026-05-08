"use strict";

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, "Please provide store."]
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    totalAmount: {
        type: Number,
        default: 0.0
    },
    status: {
        type: String
    },
    orderDate: Date
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;