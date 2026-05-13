"use strict";

const mongoose = require('mongoose'),
    slugify = require('slugify');


// ==================== STORE SCHEMA ====================
const storeSchema = mongoose.Schema({
    storeName: {
        type: String,
        required: [true, "Please provide a store name."],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide owner."]
    },
    products: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Products'}
    ],
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    settings: {
        currency: { type: String, default: 'USD' },
        taxRate: { type: Number, default: 0 },
        themeColor: { type: String, default: '#ffffff' },
        emailNotifications: { type: Boolean, default: true }
    },
    subscriptionDetails: {
        plan: { type: String, default: 'free' },
        status: { type: String, default: 'active' },
        nextBillingDate: Date,
        trialEnd: Date
    }
});



// This code runs automatically right BEFORE a store is saved
storeSchema.pre('save', function () {
    // Only run if the storeName was modified (or is new)
    if (!this.isModified('storeName')) return;

    // Create the slug: "Bob's Awesome Shoes!" -> "bobs-awesome-shoes"
    this.slug = slugify(this.storeName, { lower: true, strict: true });
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;