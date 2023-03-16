require("dotenv").config();

const express = require("express");
import { Request, Response } from "express";
const morgan = require("morgan");
const cors = require("cors");
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const {
  validateAccessToken,
} = require("./helper/auth");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
