import { Request, Response } from "express";
import { prisma, io } from "../server";
import type { createNewJobType } from "../type/auto";
import { CustomRequest } from "../type/job";
const { processUserJobs, queryUserAndJobsEntities } = require("../helper/job");

const {
  runPuppeteer,
  getPlatformJobIdFromURL,
  getPlatformJobIdDetailView,
} = require("../helper/auto");

const createNewJob = async (req: CustomRequest, res: Response) => {
  const { jobLink, interviewDate }: createNewJobType = req.body;

  const linkedInJobId = () => {
    if (jobLink.includes("linkedin") && jobLink.includes("currentJobId")) {
      getPlatformJobIdFromURL(jobLink, "curentJobId");
    } else if (
      jobLink.includes("linkedin") &&
      !jobLink.includes("currentJobId")
    ) {
      getPlatformJobIdDetailView(jobLink);
    }
  };

  const linkedInLink = `https://www.linkedin.com/jobs/view/${linkedInJobId()}`;

  const main = async () => {
    try {
      let job = await prisma.job.findFirst({
        where: {
          OR: [
            { platformJobId: platformJobIdFromURL },
            { link: { in: [linkedInLink, jobLink] } },
          ],
        },
        select: { id: true },
      });

      if (!job) {
        const jobData = await runPuppeteer(jobLink);

        for (let skill of jobData.skills) {
          await prisma.skill.upsert({
            where: { name: skill },
            create: { name: skill },
            update: {},
          });
        }

        const newJob = await prisma.job.create({
          data: {
            ...jobData,
            skills: {
              connect: jobData.skills.map((skill: string) => {
                return { name: skill };
              }),
            },
          },
        });
        job = newJob;
      }

      const bookmarkedJobs = await prisma.usersOnJobs.findMany({
        where: { userId: req.user.id, categoryId: 1, NOT: { isDeleted: true } },
      });

      const createUserOnJob = await prisma.usersOnJobs.upsert({
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

      const allJobs = await queryUserAndJobsEntities(req.user.id);
      const formatUserJobs = processUserJobs(allJobs);
      // io.on("connection", (socket) => {
      //   socket.emit("add-job", { formatUserJobs });
      // });

      return res.json(createUserOnJob);
    } catch (e) {
      console.log(e);
      res.json({ message: "Cannot create the job at the moment" });
    }
  };

  let platformJobIdFromURL: string;

  if (jobLink.includes("linkedin")) {
    if (jobLink.includes("currentJobId")) {
      platformJobIdFromURL = getPlatformJobIdFromURL(jobLink, "currentJobId");
    } else {
      platformJobIdFromURL = getPlatformJobIdDetailView(jobLink);
    }
  } else if (jobLink.includes("indeed")) {
    platformJobIdFromURL = getPlatformJobIdFromURL(jobLink, "vjk");
  } else if (jobLink.includes("ziprecruiter")) {
    platformJobIdFromURL = getPlatformJobIdFromURL(jobLink, "lvk");
  }

  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
};

module.exports = { createNewJob };
