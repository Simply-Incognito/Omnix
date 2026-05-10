"use strict";

const express = require("express");

const productsController = require(`${__dirname}/../controllers/productsController`);
const authMiddleware = require(`${__dirname}/../middleware/authMiddleware`);
const tenantMiddleware = require(`${__dirname}/../middleware/tenant`);

const router = express.Router();

router.route('/')
    .get(
        authMiddleware.protect,
        productsController.getAllProducts
    )
    .post(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin', 'staff', 'super_admin'),
        tenantMiddleware.attachTenant,
        productsController.createProduct
    );

router.route('/:id')
    .get(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        productsController.getProductById
    )
    .patch(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin', 'super_admin'),
        tenantMiddleware.attachTenant,
        productsController.getAllProducts
    )
    .delete(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin', 'super_admin'),
        tenantMiddleware.attachTenant,
        productsController.deleteProductById
    );


module.exports = router;
