"use strict";

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const AppError = require(`${__dirname}/../Utils/AppError`);
const Category = require(`${__dirname}/../models/Category`);

// Get categories (Global + Store specific if storeId is present)
exports.getCategories = asyncErrorHandler(async (req, res, next) => {
    // We fetch Global categories (storeId: null) 
    // AND the store's specific categories (if a store context exists)
    const query = {
        $or: [
            { storeId: null }
        ]
    };

    if (req.storeId) {
        query.$or.push({ storeId: req.storeId });
    }

    const categories = await Category.find(query);

    res.status(200).json({
        success: true,
        results: categories.length,
        data: { categories }
    });
});

// Create Category
exports.createCategory = asyncErrorHandler(async (req, res, next) => {
    // If it's a super_admin, they can create a global category (storeId = null)
    // If it's a vendor, we force the category to belong to their store.
    let targetStoreId = null;

    if (req.user.role !== 'super_admin') {
        if (!req.storeId) {
            return next(new AppError("Store context required to create a category", 400));
        }
        targetStoreId = req.storeId;
    }

    const category = await Category.create({
        name: req.body.name,
        description: req.body.description,
        storeId: targetStoreId
    });

    res.status(201).json({
        success: true,
        data: { category }
    });
});
