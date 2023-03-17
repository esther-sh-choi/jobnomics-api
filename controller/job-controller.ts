import { Request, Response, query } from "express";
import { CustomRequest } from "../type/job";
const {
  getUserIdByEmail,
  queryUserAndJobsEntities,
  processUserJobs,
  queryJobById,
  queryUserJobsWithFilter,
  updateAllRearrangedJobs,
  deleteUserJob,
  updateInterviewDateAndFavorite,
} = require("../helper/job");

const getAllJobs = async (req: CustomRequest, res: Response) => {
  // console.log(req.user);
  // const userId = await getUserIdByEmail(req.user.email);
  // console.log(userId);

  const userId = 1;
  const userJobs = await queryUserAndJobsEntities(userId);
  const formatUserJobs = processUserJobs(userJobs);

  res.json(formatUserJobs);
};

const getJobById = async (req: Request, res: Response) => {
  const queryJob = await queryJobById(req.params);
  console.log(queryJob);
  res.json(queryJob);
};

const filterJobs = async (req: Request, res: Response) => {
  // req.body = {userId: 1, category: ["Applied", "Bookmarked"], languages: ['javascript', 'express']}
  const userId = 1;
  const userJobs = await queryUserJobsWithFilter(
    userId,
    req.body.category,
    req.body.languages
  );
  const formatUserJobs = processUserJobs(userJobs);

  res.json(formatUserJobs);
};

const updateJobs = async (req: Request, res: Response) => {
  // req.body = { jobUpdates:[{userId: 1, jobId: 1, categoryId: 1, newCategoryId: 1, pos: 0}, {userId: 1, jobId: 2, categoryId: 2, newCategoryId: 1, position: 1}], type: "update"}
  // Example: { "jobUpdates":[
  //   {"userId": 1, "jobId": 1, "categoryId": 1, "newCategoryId": 1, "position": 0},
  //   {"userId": 1, "jobId": 2, "categoryId": 1, "newCategoryId": 2, "position": 0}
  //   {"userId": 1, "jobId": 2, "categoryId": 2, "newCategoryId": 3, "position": 1}
  //   ],
  //   "type": "update"
  // }

  await updateAllRearrangedJobs(req.body.jobUpdates);

  res.json({ message: "Update Successful" });
};

const updateJobById = async (req: Request, res: Response) => {
  // Option 1: req.body = { userId: 1, jobId: 2, categoryId: 1, type: "delete"}
  // Option 2: req.body = { userId: 1, jobId: 2, categoryId: 1, interviewDate: SomeDate, favorite: true, type: "update"}

  if (req.body.type === "delete") {
    await deleteUserJob(req.body);
    return res.json({ message: "Delete Successful" });
  }

  if (req.body.type === "update") {
    await updateInterviewDateAndFavorite(req.body);
    return res.json({ message: "Update Successful" });
  }

  res.json({ message: "Update Failed" });
};

module.exports = {
  getAllJobs,
  getJobById,
  filterJobs,
  updateJobs,
  updateJobById,
};
