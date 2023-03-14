import { Request, Response } from "express";

const getAllJobs = (req: Request, res: Response) => {
  res.json({ jobs: "SHow all jobs that have isDeleted = false" });
};

const getJobById = (req: Request, res: Response) => {
  res.json({ job: "get a single job and open modal" });
};

const filterJobs = (req: Request, res: Response) => {
  res.json({ jobs: [] });
};

const updateJobs = (req: Request, res: Response) => {
  res.json({ jobs: "When user moves the job card" });
};

const updateJobById = (req: Request, res: Response) => {
  res.json({ job: "Toggle favorite" });
};

const deleteJobById = (req: Request, res: Response) => {
  res.json({ jobs: "update isDeleted from false to true" });
};

module.exports = {
  getAllJobs,
  getJobById,
  filterJobs,
  updateJobs,
  updateJobById,
  deleteJobById,
};
