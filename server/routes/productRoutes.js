"use strict";

const express = require("express");

const productsController = require(`${__dirname}/../controllers/productsController`);
const authMiddleware = require(`${__dirname}/../middleware/authMiddleware`);
const tenantMiddleware = require(`${__dirname}/../middleware/tenant`);

const router = express.Router();

router.route('/')
    .get(
        authMiddleware.protect, 
        tenantMiddleware.attachTenant, 
        productsController.getAllProducts
    )
    .post(
        authMiddleware.protect, 
        tenantMiddleware.attachTenant, 
        productsController.createProduct
    );

module.exports = router;
