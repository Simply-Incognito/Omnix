"use strict";

const express = require("express");
const categoriesController = require(`${__dirname}/../controllers/categoriesController`);
const authMiddleware = require(`${__dirname}/../middleware/authMiddleware`);
const tenantMiddleware = require(`${__dirname}/../middleware/tenant`);

const router = express.Router();

router.route('/')
    .get(
        tenantMiddleware.attachTenant,
        categoriesController.getCategories
    )
    .post(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        categoriesController.createCategory
    );

module.exports = router;
