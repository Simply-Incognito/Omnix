"use strict";

const express = require("express");

const ordersController = require(`${__dirname}/../controllers/ordersController`);
const authMiddleware = require(`${__dirname}/../middleware/authMiddleware`);
const tenantMiddleware = require(`${__dirname}/../middleware/tenant`);



const router = express.Router();

router.route('/')
    .get(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        ordersController.getOrders
    )
    .post(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        ordersController.createOrder
    );

router.route('/status/:id')
    .patch(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        ordersController.updateOrderStatus
    );

router.route('/:id')
    .get(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        ordersController.getOrder
    )
    .patch(
        authMiddleware.protect,
        tenantMiddleware.attachTenant,
        ordersController.updateOrder
    )
.delete(
    authMiddleware.protect,
    tenantMiddleware.attachTenant,
    ordersController.deleteOrder
);

module.exports = router;