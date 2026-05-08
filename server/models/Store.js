"use strict";

const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    storeName: {
        type: String,
        required: [true, "Please provide a store name."],
        trim: true,
        unique: true
    },
    slug: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide owner."]
    },
    status: String,
    settings: String,
    subscriptionDetails: String
});


const Store = mongoose.model('Store', storeSchema);

module.exports = Store;