"use strict";
const jwt = require('jsonwebtoken');

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);

// User Model
const User = require(`${__dirname}/../Models/user`);

const createToken = (id) => {
    return jwt.sign({ id: id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN });
}

// Register - POST /register req.body = {firstname, lastname, username, email, gender, password, confirmPassword}
exports.register = asyncErrorHandler(async (req, res, next) => {

    // check if req.body is not empty

    if (!req.body) {
        return next(new AppError("Invalid request.", 400));
    }

    // Create new user
    const user = await User.create(req.body);

    // Generate Token
    const token = createToken(user._id);

    // Set JWT as Cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true for HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Response
    res.status(201).json({
        status: 'success',
        message: "User created successfully",
        token, // Also send token in response for API client
        data: { user }
    });
});

// Login - POST /login
exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Email and Password are required!", 400));
    }

    // Get User
    const user = await User.findOne({ email: email }).select('+password');

    // Verify If User Exists
    if (!user) {
        return next(new AppError("Account does not exist. Please register an account.", 404));
    }

    // Verify if password is correct
    const isPasswordMatch = await user.validateUserPassword(password, user.password);


    if (!isPasswordMatch) {
        return next(new AppError("Password is incorrect!", 404));
    }

    // Check if user account is active
    if (!user.active) {
        return next(new AppError("Your account is disabled! Please contact the administrator.", 403));
    }

    // Generate Token
    const token = createToken(user._id);

    // Set JWT as Cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true for HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send Response
    res.status(200).json({
        status: 'success',
        message: "Login successful",
        data: { user },
        token
    });
});

