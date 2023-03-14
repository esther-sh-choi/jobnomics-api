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

router.get("/:id", getJobById);

router.get("/filter", filterJobs);

router.put("/", updateJobs);

router.put("/:id", updateJobById);

router.delete("/:id", deleteJobById);

module.exports = router;
