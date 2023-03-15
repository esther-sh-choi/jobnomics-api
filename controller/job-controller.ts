import { Request, Response } from "express";
const { queryUserAndJobsEntities, processUserJobs, queryJobById, queryUserJobsWithFilter, updateAllRearrangedJobs, deleteUserJob, updateInterviewDateAndFavorite } = require("../helper/job");


const getAllJobs = async (req: Request, res: Response) => {
  // const userId = req.body.id;
  const userId = 1;
  const userJobs = await queryUserAndJobsEntities(userId);
  const formatUserJobs = processUserJobs(userJobs);

  res.json(formatUserJobs);
};

const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const queryJob = await queryJobById(id);

  res.json({ job: queryJob });
};

const filterJobs = async (req: Request, res: Response) => {
  // req.body = {userId: 1, category: ["Applied", "Bookmarked"], languages: ['javascript', 'express']}
  const userId = 1;
  const userJobs = await queryUserJobsWithFilter(userId, req.body.category, req.body.languages);
  const formatUserJobs = processUserJobs(userJobs);

  res.json({ jobs: formatUserJobs });
};

const updateJobs = async (req: Request, res: Response) => {
  // req.body = { jobBookmarkUpdates:[{userId: 1, jobId: 1, categoryId: 1, newCategoryId: 1, pos: 0}, {userId: 1, jobId: 2, categoryId: 2, newCategoryId: 1, pos: 1}], type: "update"}
  // Example: { "jobBookmarkUpdates":[
  //   {"userId": 1, "jobId": 1, "categoryId": 1, "newCategoryId": 1, "pos": 0}, 
  //   {"userId": 1, "jobId": 2, "categoryId": 1, "newCategoryId": 2, "pos": 0}
  //   {"userId": 1, "jobId": 2, "categoryId": 2, "newCategoryId": 3, "pos": 1}
  //   ], 
  //   "type": "update"
  // }
  await updateAllRearrangedJobs(req.body.jobBookmarkUpdates);

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

