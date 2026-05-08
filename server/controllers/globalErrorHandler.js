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
    const errMsg = `The ${(Object.keys(error.keyValue))[0]} '${(Object.values((error.keyValue)))[0]}' already exists`
    return new AppError(errMsg, 400);
}

const validationErrorHandler = (error) => {
    const errMsg = `${(Object.keys(error.errors))[0]} is required!`;
    return new AppError(errMsg, 400);
}

const tokenExpiredErrorHandler = (error) => {
    return new AppError("Please login", 401);
}

module.exports = (error, req, res, next) => {

    error.message = error.message || "Internal Server Error";
    error.statusCode = error.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        devError(error, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        if (error.name === 'ValidationError') error = validationErrorHandler(error);
        if (error.name === 'TokenExpiredError') error = tokenExpiredErrorHandler(error)
        prodError(error, res);
    }
}