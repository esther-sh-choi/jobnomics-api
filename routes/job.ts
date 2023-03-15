const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const {
  getAllJobs,
  getJobById,
  filterJobs,
  updateJobs,
  updateJobById,
  deleteJobById,
} = require("../controller/job-controller");

router.get("/", getAllJobs);

router.get("/filter", filterJobs);

router.get("/:id", getJobById);

router.put("/", updateJobs);

router.put("/user-job", updateJobById);


// router.put("/:id", deleteJobById);

module.exports = router;
