require("dotenv").config();

const express = require("express");
import { Request, Response } from "express";
const morgan = require("morgan");
const cors = require("cors");
import { PrismaClient } from "@prisma/client";
const { validateAccessToken } = require("./helper/auth");
const { initScheduledJobs } = require('./helper/scheduledFunctions');
const PORT = process.env.PORT || 8080;
const app = express();

export const prisma = new PrismaClient();

app.use(cors({
  origin: ['http://localhost:3000', 'https://dev--dynamic-mooncake-090d58.netlify.app', 'https://dynamic-mooncake-090d58.netlify.app', 'https://jobnomics.net']
}));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const jobRoutes = require("./routes/job");
const autoRoutes = require("./routes/auto");
const authRoutes = require("./routes/auth");

app.use("/api/v1/job", validateAccessToken, jobRoutes);
app.use("/api/v1/auto", validateAccessToken, autoRoutes);
app.use("/api/v1/auth", validateAccessToken, authRoutes);

app.get("*", (req: Request, res: Response) => {
  res.status(200).json({ message: "Invalid" });
});

initScheduledJobs();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
