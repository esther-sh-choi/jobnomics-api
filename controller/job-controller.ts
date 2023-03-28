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
  queryInterviewDate,
  queryStaleJobs,
  queryInterviewDates,
  processGetInterviews,
  queryAllNotes,
  recoverJobById,
  updateFavoriteOnly
} = require("../helper/job");

const getAllJobs = async (req: CustomRequest, res: Response) => {
  const staleJobs = await queryStaleJobs(req.user.id);
  const userJobs = await queryUserAndJobsEntities(req.user.id);
  const allActiveJobs = processUserJobs(userJobs);

  res.json({ allActiveJobs, staleJobs });
};

const getJobById = async (req: CustomRequest, res: Response) => {
  const queryJob = await queryJobById(req.params, req.user.id);

  if (!queryJob) {
    return res.json({ formattedJob: {} });
  }
  const queryChecklists = await queryChecklist(req.params, req.user.id);

  const formattedJob = combineChecklistInfo(queryJob, queryChecklists);

  res.json(formattedJob);
};

const getAllNotes = async (req: CustomRequest, res: Response) => {
  const allNotes = await queryAllNotes(req.params, req.user.id);

  res.json(allNotes);
};

const addUserChecklists = async (req: CustomRequest, res: Response) => {
  const checklistsUserJob = await createChecklistsUserJob(
    req.user.id,
    req.body.jobId
  );

  res.json({ message: "Checklists created!" });
};

const filterJobs = async (req: CustomRequest, res: Response) => {
  // req.body = {category: ["Applied", "Bookmarked"], skills: ['javascript', 'express'], columnFilterList:[]}

  const query = req.query;
  const categoryList = (query?.category as string)?.split(",");
  const skillsList = (query?.skills as string)?.split(",");
  const columnFilterList = (query?.columnFilter as string)?.split(",");
  const status = (query?.status as string)?.split(",");

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
        "Job Unavailable",
      ]
    );
  }

  const userJobs = await queryUserJobsWithFilter(
    req.user.id,
    categoryList,
    skillsList,
    columnFilterList,
    status
  );

  const formatUserJobs = processFilterJobs(userJobs);

  res.json(formatUserJobs);
};

const updateJobs = async (req: CustomRequest, res: Response) => {
  // Example: req.body = { "jobUpdates":[
  //   { "jobId": 1, "categoryId": 1, "newCategoryId": 1, "position": 0, isDeleted:false, isActive: true},
  //   { "jobId": 2, "categoryId": 1, "newCategoryId": 2, "position": 0, isDeleted:false, isActive: true}
  //   { "jobId": 2, "categoryId": 2, "newCategoryId": 3, "position": 1, isDeleted:false, isActive: false}
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

const getInterviewDate = async (req: CustomRequest, res: Response) => {
  if (Number(req.params.jobId) !== -1) {
    const getDate = await queryInterviewDate(
      req.user.id,
      Number(req.params.jobId)
    );
    return res.json(getDate);
  }
  res.json({ error: "No such entity!" });
};

const getInterviews = async (req: CustomRequest, res: Response) => {
  const getInterviews = await queryInterviewDates(req.user.id);

  const formattedInterviews = processGetInterviews(getInterviews);

  res.json(formattedInterviews);
};

const recoverJob = async (req: CustomRequest, res: Response) => {
  try {
    await recoverJobById(req.user.id, Number(req.body.jobId));

    return res.json({ message: "Job recovered" });
  } catch (e) {
    res.json({ message: "Failed to recover the job" });
  }
};

const toggleFavoriteOnly = async (req: CustomRequest, res: Response) => {
  try {
    await updateFavoriteOnly(
      req.body,
      req.user.id
    );

    return res.json({ message: "Successfully toggle favorite!" });
  } catch (e) {
    res.json({ message: "Failed to toggle favorite" });
  }
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
  getInterviewDate,
  getInterviews,
  getAllNotes,
  recoverJob,
  toggleFavoriteOnly
};
