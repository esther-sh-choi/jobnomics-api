import { Request, Response } from "express";

const getJobInfo = (req: Request, res: Response) => {
  res.json({ jobs: "Get link from user and send it to puppeteer" });
};

module.exports = { getJobInfo };
