"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { createNewJob } = require("../controller/auto-controller");
const { getUserInfo } = require('../helper/auth');
// Switched to get to check if puppeteer works
router.post("/", getUserInfo, createNewJob);
module.exports = router;
