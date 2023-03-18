import { Request, Response, query } from "express";
import { CustomRequest } from "../type/job";
const {
  queryUserAndJobsEntities,
  processUserJobs,
  queryJobById,
  queryUserJobsWithFilter,
  updateAllRearrangedJobs,
  deleteUserJob,
  updateInterviewDateAndFavoriteAndChecklist,
  queryChecklist,
  combineChecklistInfo,
  createChecklistsUserJob,
  checkJobQuestions,
  questionsFromOpenAi,
  saveQuestionsToDatabase,
  updateRejectedReason
} = require("../helper/job");


const getAllJobs = async (req: CustomRequest, res: Response) => {

  const userJobs = await queryUserAndJobsEntities(req.user.id);
  const formatUserJobs = processUserJobs(userJobs);

  res.json(formatUserJobs);
};

const getJobById = async (req: CustomRequest, res: Response) => {
  const queryJob = await queryJobById(req.params, req.user.id);

  const queryChecklists = await queryChecklist(req.params, req.user.id);

  const formattedJob = combineChecklistInfo(queryJob, queryChecklists);
  res.json(formattedJob);
};

const addUserChecklists = async (req: CustomRequest, res: Response) => {

  const checklistsUserJob = await createChecklistsUserJob(
    req.user.id,
    req.body.jobId
  );

  res.json({ message: "Checklists created!" });
};

const filterJobs = async (req: CustomRequest, res: Response) => {
  // req.body = {category: ["Applied", "Bookmarked"], skills: ['javascript', 'express']}

  const userJobs = await queryUserJobsWithFilter(
    req.user.id,
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

  await updateAllRearrangedJobs(req.body.jobUpdates, req.user.id);

  res.json({ message: "Update Successful" });
};

const updateJobById = async (req: CustomRequest, res: Response) => {
  // Option 1: req.body = { jobId: 2, categoryId: 1, type: "delete"}
  // Option 2: req.body = { jobId: 2, categoryId: 1, interviewDate: SomeDate, favorite: true, type: "update"}

  if (req.body.type === "delete") {
    await deleteUserJob(req.body, req.user.id);
    return res.json({ message: "Delete Successful" });
  }

  if (req.body.type === "update") {
    await updateInterviewDateAndFavoriteAndChecklist(req.body, req.user.id);
    return res.json({ message: "Update Successful" });
  }

  res.json({ message: "Update Failed" });
};

const createInterviewQuestions = async (req: CustomRequest, res: Response) => {
  // {
  //   "jobId": 1
  // }

  const checkIfQuestionsExist = await checkJobQuestions(req.body.jobId);

  if (req.user.id && !checkIfQuestionsExist.check) {
    const getQuestions = await questionsFromOpenAi(checkIfQuestionsExist.description);
    await saveQuestionsToDatabase(req.body.jobId, getQuestions.trim());

    return res.json({ message: "Created questions" });
  }
  res.json({ message: "No questions are created!" });
};

const rejectedJob = async (req: CustomRequest, res: Response) => {

  await updateRejectedReason(req.user.id, req.body.jobId, req.body.categoryId, req.body.description);

  res.json({ message: "Reason rejected!" });
};

module.exports = {
  getAllJobs,
  getJobById,
  filterJobs,
  updateJobs,
  updateJobById,
  addUserChecklists,
  createInterviewQuestions,
  rejectedJob
};
