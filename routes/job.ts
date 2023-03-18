const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const {
  getAllJobs,
  getJobById,
  filterJobs,
  updateJobs,
  updateJobById,
  addUserChecklists,
  createInterviewQuestions
} = require("../controller/job-controller");

const { getUserInfo } = require("../helper/auth");

router.get("/", getUserInfo, getAllJobs);

router.put("/filter", getUserInfo, filterJobs);

router.get("/:jobId/:categoryId", getUserInfo, getJobById);

router.post("/", getUserInfo, addUserChecklists);

router.post("/interview-questions", getUserInfo, createInterviewQuestions);

router.patch("/", getUserInfo, updateJobs);

router.patch("/user-job", getUserInfo, updateJobById);

// router.put("/:id", deleteJobById);

module.exports = router;
