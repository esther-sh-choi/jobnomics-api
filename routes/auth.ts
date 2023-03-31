const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const {
  logInAndSignIn,
  sendEmailVerification,
  sendSubscribeStatus,
  unsubscribe,
} = require("../controller/auth-controller");

const { getUserInfo } = require("../helper/auth");

router.get("/", getUserInfo, logInAndSignIn);

router.get("/user", getUserInfo, sendSubscribeStatus);

router.patch("/email-verification", getUserInfo, sendEmailVerification);

router.patch("/unsubscribe", getUserInfo, unsubscribe);

module.exports = router;
