const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const { getJobInfo } = require("../controller/auto-controller");

// Switched to get to check if puppeteer works
router.get("/", getJobInfo);

module.exports = router;
