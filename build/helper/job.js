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
const server_1 = require("../server");
const { requestToOpenAI } = require("./auto");
const queryUserAndJobsEntities = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return server_1.prisma.usersOnJobs.findMany({
        where: {
            userId,
            isDeleted: false,
            isActive: true,
        },
        select: {
            userId: true,
            isFavorite: true,
            interviewDate: true,
            updatedByUserAt: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            position: true,
            isActive: true,
            job: {
                select: {
                    id: true,
                    title: true,
                    company: true,
                    logo: true,
                },
            },
        },
        orderBy: {
            position: "asc",
        },
    });
});
const queryStaleJobs = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days in milliseconds
    const sixtyDaysAgo = new Date(Date.now() - 0.5 * 60 * 1000); // 60 days in milliseconds
    return yield server_1.prisma.usersOnJobs.findMany({
        where: {
            userId,
            updatedByUserAt: {
                lte: sixtyDaysAgo,
            },
            isActive: true,
        },
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            userId: true,
            updatedByUserAt: true,
            isFavorite: true,
            position: true,
            note: true,
            interviewDate: true,
            rejectReason: true,
            isDeleted: false,
            job: {
                select: {
                    id: true,
                    title: true,
                    company: true,
                    location: true,
                    description: true,
                    logo: true,
                    summary: true,
                    skills: true,
                    interviewExamples: true,
                    platform: true,
                },
            },
        },
    });
});
const processUserJobs = (userJobs) => {
    var _a, _b;
    const result = {
        Bookmarked: {
            category: "Bookmarked",
            id: 1,
            jobs: [],
        },
        Applied: {
            category: "Applied",
            id: 2,
            jobs: [],
        },
        Interviewing: {
            category: "Interviewing",
            id: 3,
            jobs: [],
        },
        Interviewed: {
            category: "Interviewed",
            id: 4,
            jobs: [],
        },
        "Job Offer": {
            category: "Job Offer",
            id: 5,
            jobs: [],
        },
        "Position Filled": {
            category: "Position Filled",
            id: 6,
            jobs: [],
        },
    };
    for (const eachJob of userJobs) {
        const categoryName = eachJob.category.name;
        const categoryId = eachJob.category.id;
        if (eachJob.category.name in result) {
            result[categoryName].jobs.push(Object.assign(Object.assign({}, eachJob.job), { position: eachJob.position, isFavorite: eachJob.isFavorite, interviewDate: eachJob.interviewDate, updatedByUserAt: eachJob.updatedByUserAt, description: (_a = eachJob.job) === null || _a === void 0 ? void 0 : _a.description }));
        }
        else {
            result[categoryName] = {
                category: categoryName,
                id: categoryId,
                jobs: [
                    Object.assign(Object.assign({}, eachJob.job), { position: eachJob.position, isFavorite: eachJob.isFavorite, interviewDate: eachJob.interviewDate, updatedByUserAt: eachJob.updatedByUserAt, description: (_b = eachJob.job) === null || _b === void 0 ? void 0 : _b.description }),
                ],
            };
        }
    }
    return result;
};
const processFilterJobs = (userJobs) => {
    var _a, _b, _c, _d, _e, _f;
    let result = [];
    for (const eachJob of userJobs) {
        const job = {
            categoryId: (_a = eachJob === null || eachJob === void 0 ? void 0 : eachJob.category) === null || _a === void 0 ? void 0 : _a.id,
            company: (_b = eachJob === null || eachJob === void 0 ? void 0 : eachJob.job) === null || _b === void 0 ? void 0 : _b.company,
            id: (_c = eachJob === null || eachJob === void 0 ? void 0 : eachJob.job) === null || _c === void 0 ? void 0 : _c.id,
            interviewDate: eachJob === null || eachJob === void 0 ? void 0 : eachJob.interviewDate,
            isFavorite: eachJob === null || eachJob === void 0 ? void 0 : eachJob.isFavorite,
            logo: (_d = eachJob === null || eachJob === void 0 ? void 0 : eachJob.job) === null || _d === void 0 ? void 0 : _d.logo,
            position: eachJob === null || eachJob === void 0 ? void 0 : eachJob.position,
            title: (_e = eachJob === null || eachJob === void 0 ? void 0 : eachJob.job) === null || _e === void 0 ? void 0 : _e.title,
            updatedByUserAt: eachJob === null || eachJob === void 0 ? void 0 : eachJob.updatedByUserAt,
            description: (_f = eachJob === null || eachJob === void 0 ? void 0 : eachJob.job) === null || _f === void 0 ? void 0 : _f.description,
            isActive: eachJob === null || eachJob === void 0 ? void 0 : eachJob.isActive
        };
        result.push(job);
    }
    return result;
};
const queryJobById = (selectedItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId, categoryId } = selectedItem;
    try {
        if (jobId && categoryId && jobId >= 0 && categoryId > 0) {
            const data = yield server_1.prisma.usersOnJobs.findFirst({
                where: {
                    user: { id: Number(userId) },
                    job: { id: Number(jobId) },
                    category: { id: Number(categoryId) },
                },
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    userId: true,
                    updatedByUserAt: true,
                    isFavorite: true,
                    position: true,
                    note: true,
                    interviewDate: true,
                    rejectReason: true,
                    isDeleted: false,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            company: true,
                            location: true,
                            description: true,
                            logo: true,
                            summary: true,
                            skills: true,
                            interviewExamples: true,
                            platform: true,
                        },
                    },
                },
            });
            return data;
        }
        else {
            return null;
        }
    }
    catch (e) {
        console.log(e);
    }
});
const queryUserJobsWithFilter = (userId, filteredCategory, filteredLanguage, columnFilter) => __awaiter(void 0, void 0, void 0, function* () {
    let orderParams = {};
    if (columnFilter[0] === "isFavorite") {
        orderParams = [
            {
                isFavorite: columnFilter[1],
            },
            {
                createdAt: "desc",
            },
        ];
    }
    else if (columnFilter[0] === "company" || columnFilter[0] === "title") {
        orderParams = {
            job: {
                [columnFilter[0]]: columnFilter[1],
            },
        };
    }
    else {
        orderParams = {
            [columnFilter[0]]: columnFilter[1],
        };
    }
    return server_1.prisma.usersOnJobs.findMany({
        where: {
            userId,
            OR: [
                {
                    job: {
                        skills: {
                            some: {
                                name: {
                                    in: filteredLanguage,
                                },
                            },
                        },
                    },
                },
                {
                    category: {
                        name: {
                            in: filteredCategory,
                        },
                    },
                },
            ],
            isDeleted: false,
        },
        select: {
            isActive: true,
            userId: true,
            updatedByUserAt: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            note: true,
            position: true,
            isFavorite: true,
            interviewDate: true,
            job: {
                select: {
                    id: true,
                    title: true,
                    company: true,
                    logo: true,
                    description: true,
                },
            },
        },
        orderBy: orderParams,
    });
});
const updateAllRearrangedJobs = (updateInformation, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let update of updateInformation) {
            const updatedData = {
                category: {
                    connect: {
                        id: update.isDeleted ? 1 : update.newCategoryId,
                    },
                },
                position: update.position,
                isDeleted: update.isDeleted,
                isActive: update.isActive,
            };
            if (update.isChanged) {
                updatedData.updatedByUserAt = new Date();
            }
            yield server_1.prisma.usersOnJobs.update({
                where: {
                    userId_jobId_categoryId: {
                        userId: userId,
                        jobId: update.jobId,
                        categoryId: update.categoryId,
                    },
                },
                data: updatedData,
            });
        }
    }
    catch (e) {
        console.log(e);
    }
});
const deleteUserJob = (deleteItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedJob = yield server_1.prisma.usersOnJobs.update({
            where: {
                userId_jobId_categoryId: {
                    userId: userId,
                    jobId: deleteItem.jobId,
                    categoryId: deleteItem.categoryId,
                },
            },
            data: {
                isDeleted: true,
                category: {
                    connect: {
                        id: 1,
                    },
                },
            },
        });
        const jobsInTheCategory = yield server_1.prisma.usersOnJobs.findMany({
            where: {
                userId: userId,
                categoryId: deleteItem.categoryId,
                isDeleted: false,
            },
            orderBy: {
                position: "asc",
            },
        });
        for (let i = 0; i < jobsInTheCategory.length; i++) {
            const userOnJob = jobsInTheCategory[i];
            const currentPosition = userOnJob.position || 0;
            const newPosition = currentPosition - 1;
            if (deleteItem.jobId && i >= (deletedJob.position || 0)) {
                yield server_1.prisma.usersOnJobs.update({
                    where: {
                        userId_jobId_categoryId: {
                            userId: userId,
                            jobId: jobsInTheCategory[i].jobId,
                            categoryId: deleteItem.categoryId,
                        },
                    },
                    data: {
                        position: newPosition,
                    },
                });
            }
        }
    }
    catch (e) {
        return e;
    }
});
const updateInterviewDateAndFavorite = (updateItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = {};
    updateData["isFavorite"] = updateItem.favorite;
    if (updateItem.interviewDate) {
        updateData["interviewDate"] = updateItem.interviewDate;
    }
    if (updateItem.updatedByUserAt) {
        updateData["updatedByUserAt"] = updateItem.updatedByUserAt;
    }
    try {
        return yield server_1.prisma.usersOnJobs.update({
            where: {
                userId_jobId_categoryId: {
                    userId: userId,
                    jobId: updateItem.jobId,
                    categoryId: updateItem.categoryId,
                },
            },
            data: Object.assign(Object.assign({}, updateData), { updatedByUserAt: new Date() }),
        });
    }
    catch (e) {
        return e;
    }
});
const getUserIdByEmail = (email) => {
    return server_1.prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
};
const createChecklistsUserJob = (userId, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const checklists = yield server_1.prisma.checklist.findMany();
    const userJobChecklists = yield server_1.prisma.usersOnChecklists.findMany({
        where: { userId, jobId },
    });
    if (userJobChecklists.length === 0) {
        for (let checklist of checklists) {
            yield server_1.prisma.usersOnChecklists.create({
                data: {
                    userId: userId,
                    jobId: jobId,
                    checklistId: checklist.id,
                    isComplete: false,
                },
            });
        }
    }
});
const updateChecklistUserJob = (selectedCheckbox, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { checklistId, jobId, isComplete } = selectedCheckbox;
    try {
        const updatedChecklist = yield server_1.prisma.usersOnChecklists.update({
            where: {
                userId_checklistId_jobId: {
                    userId,
                    checklistId,
                    jobId,
                },
            },
            data: {
                isComplete,
            },
        });
        yield server_1.prisma.usersOnJobs.update({
            where: {
                userId_jobId_categoryId: {
                    userId,
                    jobId,
                    categoryId: 4,
                },
            },
            data: {
                updatedByUserAt: new Date(),
            },
        });
        return updatedChecklist;
    }
    catch (e) {
        return e;
    }
});
const queryChecklist = (selectedItem, userId) => {
    const { jobId } = selectedItem;
    return server_1.prisma.usersOnChecklists.findMany({
        where: {
            user: { id: Number(userId) },
            job: { id: Number(jobId) },
        },
        select: {
            isComplete: true,
            checklist: {
                select: {
                    id: true,
                    description: true,
                },
            },
        },
        orderBy: {
            checklistId: "asc",
        },
    });
};
const combineChecklistInfo = (job, checklists) => {
    const formattedChecklist = checklists.map((checklist) => (Object.assign(Object.assign({}, checklist.checklist), { isComplete: checklist.isComplete })));
    const formattedJob = Object.assign(Object.assign({}, job), { checklists: formattedChecklist });
    return formattedJob;
};
const checkJobQuestions = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield server_1.prisma.job.findUnique({
        where: {
            id: jobId,
        },
        select: {
            description: true,
            interviewExamples: true,
        },
    });
    if (job === null || job === void 0 ? void 0 : job.interviewExamples) {
        return { check: true, description: null };
    }
    return { check: false, description: job === null || job === void 0 ? void 0 : job.description };
});
const questionsFromOpenAi = (description) => __awaiter(void 0, void 0, void 0, function* () {
    return requestToOpenAI(description, "interview");
});
const saveQuestionsToDatabase = (jobId, description) => __awaiter(void 0, void 0, void 0, function* () {
    return server_1.prisma.job.update({
        where: {
            id: jobId,
        },
        data: {
            interviewExamples: description,
        },
    });
});
const updateNoteInUserJob = (noteObj, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { note, jobId, categoryId } = noteObj;
    try {
        return yield server_1.prisma.usersOnJobs.update({
            where: {
                userId_jobId_categoryId: {
                    userId,
                    jobId,
                    categoryId,
                },
            },
            data: {
                note,
                updatedByUserAt: new Date(),
            },
        });
    }
    catch (e) {
        return e;
    }
});
const updateRejectedReason = (userId, jobId, categoryId, reason) => {
    return server_1.prisma.usersOnJobs.update({
        where: {
            userId_jobId_categoryId: {
                userId,
                jobId: Number(jobId),
                categoryId: Number(categoryId),
            },
        },
        data: {
            rejectReason: reason,
            updatedByUserAt: new Date(),
        },
    });
};
const queryInterviewDate = (userId, jobId) => {
    console.log(userId);
    console.log(jobId);
    return server_1.prisma.usersOnJobs.findFirst({
        where: {
            userId,
            jobId,
        },
        select: {
            interviewDate: true,
        },
    });
};
const queryInterviewDates = (userId) => {
    return server_1.prisma.usersOnJobs.findMany({
        where: {
            userId,
            NOT: { interviewDate: null },
        },
        select: {
            interviewDate: true,
            job: {
                select: {
                    id: true,
                    title: true,
                    company: true,
                },
            },
        },
    });
};
const processGetInterviews = (interviews) => {
    const result = [];
    for (const interview of interviews) {
        const newFormatInterview = {
            interviewDate: interview.interviewDate,
            title: interview.job.title,
            company: interview.job.company,
        };
        result.push(newFormatInterview);
    }
    return result;
};
const queryAllNotes = (orderBy, userId) => {
    const { column, order } = orderBy;
    const orderByObj = {};
    if (column === "title" || column === "company") {
        orderByObj.job = {
            [column]: order,
        };
    }
    else {
        orderByObj[column] = order;
    }
    return server_1.prisma.usersOnJobs.findMany({
        where: {
            userId,
            isDeleted: false,
            AND: [
                {
                    note: {
                        not: null,
                    },
                },
                {
                    note: {
                        not: "",
                    },
                },
            ],
        },
        select: {
            userId: true,
            isFavorite: true,
            interviewDate: true,
            updatedByUserAt: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            job: {
                select: {
                    id: true,
                    title: true,
                    company: true,
                    logo: true,
                },
            },
            note: true,
        },
        orderBy: orderByObj,
    });
};
module.exports = {
    queryUserAndJobsEntities,
    processUserJobs,
    queryJobById,
    queryUserJobsWithFilter,
    updateAllRearrangedJobs,
    deleteUserJob,
    updateInterviewDateAndFavorite,
    getUserIdByEmail,
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
};
