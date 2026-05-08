"use strict";

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const CustomError = require(`${__dirname}/../Utils/CustomError`);

// User Model
const User = require(`${__dirname}/../Models/user`);

exports.promoteUser = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new CustomError("User not found!", 404));
    }

    user.role = "admin";
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: "success",
        message: "User promoted to admin successfully",
        data: { user }
    });
});
