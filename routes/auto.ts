const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const { createNewJob } = require("../controller/auto-controller");
const { getUserInfo } = require('../helper/auth');

// Switched to get to check if puppeteer works
router.post("/", getUserInfo, createNewJob);

module.exports = router;
