const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const { getJobInfo } = require("../controller/auto-controller");

router.post("/", getJobInfo);

module.exports = router;
