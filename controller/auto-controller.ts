import { Request, Response } from "express";
import { prisma } from "../server";
const {
  runPuppeteer,
  getPlatformJobIdFromURL,
  getPlatformJobIdDetailView,
} = require("../helper/auto");

const createNewJob = async (req: Request, res: Response) => {
  const jobLink = req.body.link;

  const main = async () => {
    const job = await prisma.job.findFirst({
      where: { platformJobId: platformJobIdFromURL },
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

      await prisma.job.create({
        data: {
          ...jobData,
          skills: {
            connect: jobData.skills.map((skill: string) => {
              return { name: skill };
            }),
          },
        },
      });
    }

    const allJobs = await prisma.job.findMany({
      include: {
        skills: true,
      },
    });

    res.json(allJobs);
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
