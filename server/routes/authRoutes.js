"use strict";

const authController = require(`${__dirname}/../controllers/authController`);

const router = require("express").Router();

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);

module.exports = router;