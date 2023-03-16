const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const { logInAndSignIn } = require("../controller/auth-controller");

const { getUserInfo } = require('../helper/auth');

router.get("/", getUserInfo, logInAndSignIn);

module.exports = router;