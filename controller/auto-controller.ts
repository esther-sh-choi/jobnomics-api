import { Request, Response } from "express";
import { prisma, io } from "../server";
import type { createNewJobType } from "../type/auto";
import { CustomRequest } from "../type/job";
const { getUserIdByEmail } = require("../helper/job");

const {
  runPuppeteer,
  getPlatformJobIdFromURL,
  getPlatformJobIdDetailView,
} = require("../helper/auto");

const createNewJob = async (req: CustomRequest, res: Response) => {
  const { jobLink, position, interviewDate }: createNewJobType = req.body;
  const user = await getUserIdByEmail(req.user.email);

  const main = async () => {
    try {
      let job = await prisma.job.findFirst({
        where: { platformJobId: platformJobIdFromURL },
        select: { id: true },
      });

      if (!job) {
        const jobData = await runPuppeteer(jobLink);

        jobData.skills.forEach(async (skill: string) => {
          await prisma.skill.upsert({
            where: { name: skill },
            create: { name: skill },
            update: {},
          });
        });

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

      const createUserOnJob = await prisma.usersOnJobs.create({
        data: {
          position,
          interviewDate,
          user: { connect: { id: user.id } },
          job: { connect: { id: job?.id } },
          category: { connect: { id: 1 } },
        },
      });

      const getAllJobs = await queryUserAndJobsEntities();
      io.emit;
      // query the jobs here
      // socket io .emit("","")
      // broadcast to all active user

      return res.json(createUserOnJob);
    } catch (e) {
      res.json({ message: "Cannot create the job at the moment" });
    }

    // res.json({ message: "Cannot create the job at the moment" });
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
function queryUserAndJobsEntities() {
  throw new Error("Function not implemented.");
}
