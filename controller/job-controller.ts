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
  queryChecklist,
  combineChecklistInfo
} = require("../helper/job");

const getAllJobs = async (req: CustomRequest, res: Response) => {
  const user = await getUserIdByEmail(req.user.email);

  const userJobs = await queryUserAndJobsEntities(user.id);
  const formatUserJobs = processUserJobs(userJobs);

  res.json(formatUserJobs);
};

const getJobById = async (req: CustomRequest, res: Response) => {
  // Get userId by doing user.id
  const user = await getUserIdByEmail(req.user.email);

  const queryJob = await queryJobById(req.params, user.id);

  const queryChecklists = await queryChecklist(req.params, user.id);

  const formattedJob = combineChecklistInfo(queryJob, queryChecklists);

  console.log(formattedJob);

  res.json(formattedJob);
};

const filterJobs = async (req: CustomRequest, res: Response) => {
  // req.body = {category: ["Applied", "Bookmarked"], skills: ['javascript', 'express']}

  // Get userId by doing user.id
  const user = await getUserIdByEmail(req.user.email);

  const userJobs = await queryUserJobsWithFilter(
    user.id,
    req.body.category,
    req.body.skills
  );
  const formatUserJobs = processUserJobs(userJobs);

  res.json(formatUserJobs);
};

const updateJobs = async (req: CustomRequest, res: Response) => {
  // req.body = { jobUpdates:[{jobId: 1, categoryId: 1, newCategoryId: 1, pos: 0}, {jobId: 2, categoryId: 2, newCategoryId: 1, position: 1}], type: "update"}
  // Example: { "jobUpdates":[
  //   { "jobId": 1, "categoryId": 1, "newCategoryId": 1, "position": 0},
  //   { "jobId": 2, "categoryId": 1, "newCategoryId": 2, "position": 0}
  //   { "jobId": 2, "categoryId": 2, "newCategoryId": 3, "position": 1}
  //   ],
  //   "type": "update"
  // }

  // Get userId by doing user.id
  const user = await getUserIdByEmail(req.user.email);

  await updateAllRearrangedJobs(req.body.jobUpdates, user.id);

  res.json({ message: "Update Successful" });
};

const updateJobById = async (req: CustomRequest, res: Response) => {
  // Option 1: req.body = { jobId: 2, categoryId: 1, type: "delete"}
  // Option 2: req.body = { jobId: 2, categoryId: 1, interviewDate: SomeDate, favorite: true, type: "update"}

  // Get userId by doing user.id
  const user = await getUserIdByEmail(req.user.email);

  if (req.body.type === "delete") {
    await deleteUserJob(req.body, user.id);
    return res.json({ message: "Delete Successful" });
  }

  if (req.body.type === "update") {
    await updateInterviewDateAndFavorite(req.body, user.id);
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
