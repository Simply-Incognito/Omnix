"use strict";

const router = require('express').Router();

const analyticsController = require(`${__dirname}/../controllers/analyticsController`);
const authMiddleware = require(`${__dirname}/../middleware/authMiddleware`);
const tenantMiddleware = require(`${__dirname}/../middleware/tenant`);



// ----------------- SUPER ADMIN ROUTES --------------------------  //

// Route to get total revenue per store, protected by authentication and restricted to super-admin role
router.route('/revenue')
    .get(
        authMiddleware.protect,
        authMiddleware.restrictTo('super_admin'),
        analyticsController.getTotalRevenuePerStore
    );

router.route('/top-products')
    .get(
        authMiddleware.protect,
        authMiddleware.restrictTo('super_admin'),
        analyticsController.getTopSellingProducts
    );
router.route('/new-customers').get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super_admin'),
    analyticsController.getNewCustomerSignupsThisMonth
);

router.route('/overview')
    .get(
        authMiddleware.protect,
        authMiddleware.restrictTo('super_admin'),
        analyticsController.getPlatformOverview
    );

// ----------------- VENDOR ROUTES --------------------------  //

router.route('/vendor/revenue')
    .get(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin'),
        tenantMiddleware.attachTenant,
        analyticsController.getVendorRevenue
    );

router.route('/vendor/top-products')
    .get(
        authMiddleware.protect,
        authMiddleware.restrictTo('vendor_admin'),
        tenantMiddleware.attachTenant,
        analyticsController.getVendorTopSellingProducts
    );


module.exports = router;