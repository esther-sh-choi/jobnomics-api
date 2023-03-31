const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const {
  logInAndSignIn,
  sendEmailVerification,
  sendSubscribeStatus,
} = require("../controller/auth-controller");

const { getUserInfo } = require("../helper/auth");

router.get("/", getUserInfo, logInAndSignIn);

router.get("/user", getUserInfo, sendSubscribeStatus);

router.patch("/email-verification", getUserInfo, sendEmailVerification);

module.exports = router;
