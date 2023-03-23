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
  createInterviewQuestions,
  updateNote,
  rejectedJob,
  updateChecklist,
  getInterviewDate
} = require("../controller/job-controller");

const { getUserInfo } = require("../helper/auth");

router.get("/", getUserInfo, getAllJobs);

router.get("/filter", getUserInfo, filterJobs);

router.get("/:jobId/:categoryId", getUserInfo, getJobById);

router.get("/:jobId/", getUserInfo, getInterviewDate);

router.post("/", getUserInfo, addUserChecklists);

router.post("/interview-questions", getUserInfo, createInterviewQuestions);

router.patch("/", getUserInfo, updateJobs);

router.patch("/user-job", getUserInfo, updateJobById);

router.patch("/checklist", getUserInfo, updateChecklist);

router.patch("/note", getUserInfo, updateNote);

router.patch("/rejected-reason", getUserInfo, rejectedJob);

// router.put("/:id", deleteJobById);

module.exports = router;
