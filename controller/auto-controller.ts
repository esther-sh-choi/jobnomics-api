import { Request, Response } from "express";
const { runPuppeteer } = require("../helper/auto");

const getJobInfo = async (req: Request, res: Response) => {
  const jobLink = req.body.link;
  console.log(jobLink);

  // await runPuppeteer(jobLink);
  await runPuppeteer("https://www.linkedin.com/jobs/search/?currentJobId=3523596546&distance=25&geoId=101174742&keywords=js%20developer&position=4&pageNum=0");

  res.json({ message: "Hello Auto" });
};

module.exports = { getJobInfo };
