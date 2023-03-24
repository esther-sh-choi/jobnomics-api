"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { logInAndSignIn, sendEmailVerification } = require("../controller/auth-controller");
const { getUserInfo } = require('../helper/auth');
router.get("/", getUserInfo, logInAndSignIn);
router.patch("/email-verification", getUserInfo, sendEmailVerification);
module.exports = router;
