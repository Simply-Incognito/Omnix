"use strict";

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category must have a name"],
        trim: true
    },
    // If storeId is NULL, it is a GLOBAL category. 
    // If storeId has an ID, it is a STORE-SPECIFIC category.
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        default: null 
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
