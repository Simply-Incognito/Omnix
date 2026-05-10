"use strict";

const express = require("express");

const storesController = require(`${__dirname}/../controllers/storesController`);
const authMiddleware = require(`${__dirname}/../middleware/authMiddleware`);
const tenantMiddleware = require(`${__dirname}/../middleware/tenant`);



const router = express.Router();

router.route('/')
    .post(authMiddleware.protect, storesController.addVendor)
    .get(authMiddleware.protect, storesController.getStores)
    .patch(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin', 'super_admin'),
        tenantMiddleware.attachTenant,
        storesController.updateStore
    ).delete(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin', 'super_admin'),
        tenantMiddleware.attachTenant,
        storesController.deactivateStore
    );

router.route('/my-store')
    .get(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        storesController.getMyStore
    );


router.route('/staff')
    .post(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin', 'super_admin'),
        tenantMiddleware.attachTenant,
        storesController.addStaff
    );





module.exports = router;