"use strict";

const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    validator = require('validator');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: [true, 'Please provide a first name.']
    },
    lastname: {
        type: String,
        trim: true,
        required: [true, 'Please provide a last name.']
    },
    username: {
        type: String,
        trim: true,
        required: [true, 'Please provide a username.']
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Please provide a phone number.'],
        unique: true,
        validate: { validator: validator.isMobilePhone, message: 'Please provide a valid phone number' }
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please provide an email.'],
        validate: { validator: validator.isEmail, message: 'Please provide a valid email' },
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
    employedAtStoreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
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
            validator: function (val) {
                return val === this.password;
            },
            message: "Passwords do not match!"
        }
    },
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwordResetTokenExpires: Date,
    createdAt: Date
}, { timeStamp: true });

// Hash Password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;

    // Password Changed at (for JWT)
    this.passwordChangedAt = Date.now() - 1000;
});

// Instance method to Validate user password for login
userSchema.methods.validateUserPassword = function (password, hash) {
    return bcrypt.compare(password, hash);
}

// Instance method to check if password was changed after token generation
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        // Convert Date object to milliseconds and compare
        return this.passwordChangedAt.getTime() / 1000 > JWTTimestamp;
    }
    return false;
};


module.exports = mongoose.model('User', userSchema);
