"use strict";

const AppError = require(`${__dirname}/../Utils/AppError`);

const devError = (error, res) => {

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const prodError = (error, res) => {

    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }

    res.status(500).json({
        status: 'Server Error',
        message: "Internal Server Error: Something went wrong. Please try again later."
    });


}

const duplicateKeyErrorHandler = (error) => {
    // Check if the error contains 'name' (for our compound product index)
    if (error.keyValue && error.keyValue.name) {
        return new AppError(`A product with the name '${error.keyValue.name}' already exists in your store!`, 400);
    }

    // Fallback for normal unique indexes
    const key = Object.keys(error.keyValue)[0];
    const val = Object.values(error.keyValue)[0];
    return new AppError(`The ${key} '${val}' already exists.`, 400);
}

const validationErrorHandler = (error) => {
    const errMsg = `${(Object.keys(error.errors))[0]} is required!`;
    return new AppError(errMsg, 400);
}

const tokenExpiredErrorHandler = (error) => {
    return new AppError("Session Expired! Please login again.", 401);
}

const invalidTokenErrorHandler = (error) => {
    return new AppError("Invalid token! Please login again.", 401);
}

module.exports = (error, req, res, next) => {

    error.message = error.message || "Internal Server Error";
    error.statusCode = error.statusCode || 500;

    // Transform specific MongoDB errors into nice AppErrors
    let err = { ...error };
    err.message = error.message; // Spread operator doesn't copy non-enumerable properties like message
    err.name = error.name;

    if (error.code === 11000) err = duplicateKeyErrorHandler(error);
    if (error.name === 'ValidationError') err = validationErrorHandler(error);
    if (error.name === 'TokenExpiredError') err = tokenExpiredErrorHandler(error);
    if (error.name === 'JsonWebTokenError') err = invalidTokenErrorHandler(error);

    if (process.env.NODE_ENV === 'development') {
        devError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        prodError(err, res);
    }
}