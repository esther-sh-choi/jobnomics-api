"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { queryUserAndJobsEntities, processUserJobs, queryJobById, queryUserJobsWithFilter, updateAllRearrangedJobs, deleteUserJob, updateInterviewDateAndFavorite, queryChecklist, combineChecklistInfo, createChecklistsUserJob, checkJobQuestions, questionsFromOpenAi, saveQuestionsToDatabase, updateNoteInUserJob, updateRejectedReason, updateChecklistUserJob, processFilterJobs, queryInterviewDate, queryStaleJobs, queryInterviewDates, processGetInterviews, queryAllNotes, } = require("../helper/job");
const getAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const staleJobs = yield queryStaleJobs(req.user.id);
    const userJobs = yield queryUserAndJobsEntities(req.user.id);
    const allActiveJobs = processUserJobs(userJobs);
    res.json({ allActiveJobs, staleJobs });
});
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryJob = yield queryJobById(req.params, req.user.id);
    if (!queryJob) {
        return res.json({ formattedJob: {} });
    }
    const queryChecklists = yield queryChecklist(req.params, req.user.id);
    const formattedJob = combineChecklistInfo(queryJob, queryChecklists);
    res.json(formattedJob);
});
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allNotes = yield queryAllNotes(req.params, req.user.id);
    res.json(allNotes);
});
const addUserChecklists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checklistsUserJob = yield createChecklistsUserJob(req.user.id, req.body.jobId);
    res.json({ message: "Checklists created!" });
});
const filterJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // req.body = {category: ["Applied", "Bookmarked"], skills: ['javascript', 'express'], columnFilterList:[]}
    var _a, _b, _c;
    const query = req.query;
    const categoryList = (_a = query === null || query === void 0 ? void 0 : query.category) === null || _a === void 0 ? void 0 : _a.split(",");
    const skillsList = (_b = query === null || query === void 0 ? void 0 : query.skills) === null || _b === void 0 ? void 0 : _b.split(",");
    const columnFilterList = (_c = query === null || query === void 0 ? void 0 : query.columnFilter) === null || _c === void 0 ? void 0 : _c.split(",");
    if (categoryList.length === 1 &&
        categoryList[0] === "" &&
        skillsList.length === 1 &&
        skillsList[0] === "") {
        categoryList.push(...[
            "Bookmarked",
            "Applied",
            "Interviewing",
            "Interviewed",
            "Job Offer",
            "Job Unavailable",
        ]);
    }
    const userJobs = yield queryUserJobsWithFilter(req.user.id, categoryList, skillsList, columnFilterList);
    const formatUserJobs = processFilterJobs(userJobs);
    res.json(formatUserJobs);
});
const updateJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Example: req.body = { "jobUpdates":[
    //   { "jobId": 1, "categoryId": 1, "newCategoryId": 1, "position": 0, isDeleted:false, isActive: true},
    //   { "jobId": 2, "categoryId": 1, "newCategoryId": 2, "position": 0, isDeleted:false, isActive: true}
    //   { "jobId": 2, "categoryId": 2, "newCategoryId": 3, "position": 1, isDeleted:false, isActive: false}
    //   ],
    //   "type": "update"
    // }
    yield updateAllRearrangedJobs(req.body.jobUpdates, req.user.id);
    const userJobs = yield queryUserAndJobsEntities(req.user.id);
    const formatUserJobs = processUserJobs(userJobs);
    res.json({ data: formatUserJobs });
});
const updateJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Option 1: req.body = { jobId: 2, categoryId: 1, type: "delete"}
    // Option 2: req.body = { jobId: 2, categoryId: 1, interviewDate: SomeDate, favorite: true, type: "update"}
    if (req.body.type === "delete") {
        yield deleteUserJob(req.body, req.user.id);
        return res.json({ message: "completed" });
    }
    if (req.body.type === "update") {
        const updateResult = yield updateInterviewDateAndFavorite(req.body, req.user.id);
        return res.json({ response: updateResult });
    }
    res.json({ message: "Update Failed" });
});
const createInterviewQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // {
    //   "jobId": 1
    // }
    const checkIfQuestionsExist = yield checkJobQuestions(req.body.jobId);
    if (req.user.id && !checkIfQuestionsExist.check) {
        const getQuestions = yield questionsFromOpenAi(checkIfQuestionsExist.description);
        yield saveQuestionsToDatabase(req.body.jobId, getQuestions.trim());
        // io.on("connection", (socket) => {
        //   socket.emit("interview-questions", { message: "Created questions" });
        // });
        return res.json({ message: "Created questions" });
    }
    res.json({ message: "No questions are created!" });
});
const updateChecklist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield updateChecklistUserJob(req.body, req.user.id);
    return res.json({ response });
});
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield updateNoteInUserJob(req.body, req.user.id);
    return res.json({ data: response });
});
const rejectedJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield updateRejectedReason(req.user.id, req.body.jobId, req.body.categoryId, req.body.reason);
    res.json({ message: "Reason rejected!" });
});
const getInterviewDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (Number(req.params.jobId) !== -1) {
        console.log(req.params);
        const getDate = yield queryInterviewDate(req.user.id, Number(req.params.jobId));
        return res.json(getDate);
    }
    res.json({ error: "No such entity!" });
});
const getInterviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getInterviews = yield queryInterviewDates(req.user.id);
    const formattedInterviews = processGetInterviews(getInterviews);
    res.json(formattedInterviews);
});
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
};
