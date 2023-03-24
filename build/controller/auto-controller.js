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
const { processUserJobs, queryUserAndJobsEntities } = require("../helper/job");
const { runPuppeteer, getPlatformJobIdFromURL, getPlatformJobIdDetailView, compileManualData, } = require("../helper/auto");
const createNewJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobLink, interviewDate, manualForm, type } = req.body;
    const linkedInJobId = () => {
        if (jobLink.includes("linkedin") && jobLink.includes("currentJobId")) {
            getPlatformJobIdFromURL(jobLink, "curentJobId");
        }
        else if (jobLink.includes("linkedin") &&
            !jobLink.includes("currentJobId")) {
            getPlatformJobIdDetailView(jobLink);
        }
    };
    const linkedInLink = `https://www.linkedin.com/jobs/view/${linkedInJobId()}`;
    const main = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let job = yield server_1.prisma.job.findFirst({
                where: {
                    OR: [
                        { platformJobId: platformJobIdFromURL },
                        { link: { in: [linkedInLink, jobLink] } },
                    ],
                },
                select: { id: true },
            });
            if (!job) {
                let jobData = type === "link"
                    ? yield runPuppeteer(jobLink)
                    : yield compileManualData(manualForm);
                for (let skill of jobData.skills) {
                    yield server_1.prisma.skill.upsert({
                        where: { name: skill },
                        create: { name: skill },
                        update: {},
                    });
                }
                const newJob = yield server_1.prisma.job.create({
                    data: Object.assign(Object.assign({}, jobData), { skills: {
                            connect: jobData.skills.map((skill) => {
                                return { name: skill };
                            }),
                        } }),
                });
                job = newJob;
            }
            const bookmarkedJobs = yield server_1.prisma.usersOnJobs.findMany({
                where: { userId: req.user.id, categoryId: 1, NOT: { isDeleted: true } },
            });
            const createUserOnJob = yield server_1.prisma.usersOnJobs.upsert({
                where: {
                    userId_jobId_categoryId: {
                        userId: req.user.id,
                        jobId: job.id,
                        categoryId: 1,
                    },
                },
                create: {
                    position: bookmarkedJobs.length,
                    interviewDate,
                    isDeleted: false,
                    user: { connect: { id: req.user.id } },
                    job: { connect: { id: job.id } },
                    category: { connect: { id: 1 } },
                },
                update: {
                    position: bookmarkedJobs.length,
                    interviewDate: null,
                    isDeleted: false,
                    note: "",
                    isFavorite: false,
                    rejectReason: "",
                },
            });
            // const allJobs = await queryUserAndJobsEntities(req.user.id);
            // const formatUserJobs = processUserJobs(allJobs);
            // io.on("connection", (socket) => {
            //   socket.emit("add-job", { formatUserJobs });
            // });
            return res.json(createUserOnJob);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({ error: "Error in creating job!" });
        }
    });
    let platformJobIdFromURL;
    if (jobLink.includes("linkedin")) {
        if (jobLink.includes("currentJobId")) {
            platformJobIdFromURL = getPlatformJobIdFromURL(jobLink, "currentJobId");
        }
        else {
            platformJobIdFromURL = getPlatformJobIdDetailView(jobLink);
        }
    }
    else if (jobLink.includes("indeed")) {
        platformJobIdFromURL = getPlatformJobIdFromURL(jobLink, "vjk");
    }
    else if (jobLink.includes("ziprecruiter")) {
        platformJobIdFromURL = getPlatformJobIdFromURL(jobLink, "lvk");
    }
    main()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server_1.prisma.$disconnect();
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(e);
        yield server_1.prisma.$disconnect();
        process.exit(1);
    }));
});
module.exports = { createNewJob };
