import { Request, Response, query } from "express";
import { io } from "../server";
import { CustomRequest } from "../type/job";
const {
  queryUserAndJobsEntities,
  processUserJobs,
  queryJobById,
  queryUserJobsWithFilter,
  updateAllRearrangedJobs,
  deleteUserJob,
  updateInterviewDateAndFavorite,
  queryChecklist,
  combineChecklistInfo,
  createChecklistsUserJob,
  checkJobQuestions,
  questionsFromOpenAi,
  saveQuestionsToDatabase,
  updateNoteInUserJob,
  updateRejectedReason,
  updateChecklistUserJob,
  processFilterJobs,
  updateInactiveJobs,
  processInactiveJobs,
} = require("../helper/job");

const getAllJobs = async (req: CustomRequest, res: Response) => {
  await updateInactiveJobs();
  const userJobs = await queryUserAndJobsEntities(req.user.id);
  const allActiveJobs = processUserJobs(userJobs);
  const inactiveJobs = await processInactiveJobs(req.user.id);

  res.json({ allActiveJobs, inactiveJobs });
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

  const query = req.query;
  const categoryList = (query?.category as string)?.split(",");
  const skillsList = (query?.skills as string)?.split(",");
  const columnFilterList = (query?.columnFilter as string)?.split(",");

  if (
    categoryList.length === 1 &&
    categoryList[0] === "" &&
    skillsList.length === 1 &&
    skillsList[0] === ""
  ) {
    categoryList.push(
      ...[
        "Bookmarked",
        "Applied",
        "Interviewing",
        "Interviewed",
        "Job Offer",
        "Position Filled",
      ]
    );
  }

  const userJobs = await queryUserJobsWithFilter(
    req.user.id,
    categoryList,
    skillsList,
    columnFilterList
  );

  const formatUserJobs = processFilterJobs(userJobs);

  res.json(formatUserJobs);
};

const updateJobs = async (req: CustomRequest, res: Response) => {
  // Example: req.body = { "jobUpdates":[
  //   { "jobId": 1, "categoryId": 1, "newCategoryId": 1, "position": 0, isDeleted:false},
  //   { "jobId": 2, "categoryId": 1, "newCategoryId": 2, "position": 0, isDeleted:false}
  //   { "jobId": 2, "categoryId": 2, "newCategoryId": 3, "position": 1, isDeleted:false}
  //   ],
  //   "type": "update"
  // }

  await updateAllRearrangedJobs(req.body.jobUpdates, req.user.id);
  const userJobs = await queryUserAndJobsEntities(req.user.id);
  const formatUserJobs = processUserJobs(userJobs);

  res.json({ data: formatUserJobs });
};

const updateJobById = async (req: CustomRequest, res: Response) => {
  // Option 1: req.body = { jobId: 2, categoryId: 1, type: "delete"}
  // Option 2: req.body = { jobId: 2, categoryId: 1, interviewDate: SomeDate, favorite: true, type: "update"}

  if (req.body.type === "delete") {
    await deleteUserJob(req.body, req.user.id);
    return res.json({ message: "completed" });
  }

  if (req.body.type === "update") {
    const updateResult = await updateInterviewDateAndFavorite(
      req.body,
      req.user.id
    );
    return res.json({ response: updateResult });
  }

  res.json({ message: "Update Failed" });
};

const createInterviewQuestions = async (req: CustomRequest, res: Response) => {
  // {
  //   "jobId": 1
  // }

  const checkIfQuestionsExist = await checkJobQuestions(req.body.jobId);

  if (req.user.id && !checkIfQuestionsExist.check) {
    const getQuestions = await questionsFromOpenAi(
      checkIfQuestionsExist.description
    );
    await saveQuestionsToDatabase(req.body.jobId, getQuestions.trim());

    // io.on("connection", (socket) => {
    //   socket.emit("interview-questions", { message: "Created questions" });
    // });

    return res.json({ message: "Created questions" });
  }
  res.json({ message: "No questions are created!" });
};

const updateChecklist = async (req: CustomRequest, res: Response) => {
  const response = await updateChecklistUserJob(req.body, req.user.id);
  return res.json({ response });
};

const updateNote = async (req: CustomRequest, res: Response) => {
  const response = await updateNoteInUserJob(req.body, req.user.id);
  return res.json({ data: response });
};

const rejectedJob = async (req: CustomRequest, res: Response) => {
  await updateRejectedReason(
    req.user.id,
    req.body.jobId,
    req.body.categoryId,
    req.body.reason
  );

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
  updateNote,
  rejectedJob,
  updateChecklist,
};
