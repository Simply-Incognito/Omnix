"use strict";

const { Schema, model } = require('mongoose');

const validator = require('validator');

const userSchema = Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide a name.']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please provide an email.'],
        validate: [validator.isEmail, "Please provide a valid email"],
        unique: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'vendor_admin', 'staff', 'customer'],
        default: 'customer'
    },
    profilePhoto: String,
    active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        trim: true
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password!"],
        trim: true,
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: "Passwords do not match!"
        }
    },
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwordResetTokenExpires: Date
});


const User = model('User', userSchema);

module.exports = User;