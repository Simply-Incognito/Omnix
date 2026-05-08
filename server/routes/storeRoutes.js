"use strict";

const express = require("express");

const storesController = require(`${__dirname}/../controllers/storesController`);
const authMiddleware = require(`${__dirname}/../middleware/authMiddleware`);

const router = express.Router();

router.route('/')
    .post(authMiddleware.protect, storesController.addVendor)
    .get(authMiddleware.protect, storesController.getStores);





module.exports = router;