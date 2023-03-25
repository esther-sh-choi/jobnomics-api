require("dotenv").config();

const express = require("express");
import { createServer } from "http";
import { Request, Response } from "express";
const morgan = require("morgan");
const cors = require("cors");
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
const cron = require('cron');
const { validateAccessToken } = require("./helper/auth");
const { initScheduledJobs } = require('./helper/scheduledFunctions');
const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);

export const prisma = new PrismaClient();
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const jobRoutes = require("./routes/job");
const autoRoutes = require("./routes/auto");
const authRoutes = require("./routes/auth");

app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/auto", autoRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("*", (req: Request, res: Response) => {
  res.status(200).json({ message: "Invalid" });
});

initScheduledJobs();

httpServer.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
