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

router.put("/filter", getUserInfo, filterJobs);

router.get("/:userId/:jobId/:categoryId", getUserInfo, getJobById);

router.patch("/", getUserInfo, updateJobs);

router.patch("/user-job", getUserInfo, updateJobById);

// router.put("/:id", deleteJobById);

module.exports = router;
