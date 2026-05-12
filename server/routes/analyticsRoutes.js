"use strict";

const router = require('express').Router();

const analyticsController = require(`${__dirname}/../controllers/analyticsController`);
const authMiddleware = require(`${__dirname}/../middlewares/authMiddleware`);



// Route to get total revenue per store, protected by authentication and restricted to super-admin role
router.route('/revenue')
    .get(
        authMiddleware.protect,
        authMiddleware.restrictTo('super-admin'),
        analyticsController.getTotalRevenuePerStore
    );
    
// router.route('/top-products').get(analyticsController.getTopSellingProducts);
// router.route('/new-customers').get(analyticsController.getNewCustomerSignupsThisMonth);


module.exports = router;