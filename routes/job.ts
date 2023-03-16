const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const {
  getAllJobs,
  getJobById,
  filterJobs,
  updateJobs,
  updateJobById,
} = require("../controller/job-controller");

const { getUserInfo } = require("../helper/auth");

router.get("/", getUserInfo, getAllJobs);

router.put("/filter", filterJobs);

router.get("/:id", getJobById);

router.patch("/", updateJobs);

router.put("/user-job", updateJobById);

// router.put("/:id", deleteJobById);

module.exports = router;
