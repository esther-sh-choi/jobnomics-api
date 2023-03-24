"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.prisma = void 0;
require("dotenv").config();
const express = require("express");
const http_1 = require("http");
const morgan = require("morgan");
const cors = require("cors");
const client_1 = require("@prisma/client");
const socket_io_1 = require("socket.io");
const cron = require('cron');
const { validateAccessToken } = require("./helper/auth");
const { initScheduledJobs } = require('./helper/scheduledFunctions');
const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = (0, http_1.createServer)(app);
exports.prisma = new client_1.PrismaClient();
exports.io = new socket_io_1.Server(httpServer, {
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
app.use("/api/v1/job", validateAccessToken, jobRoutes);
app.use("/api/v1/auto", validateAccessToken, autoRoutes);
app.use("/api/v1/auth", validateAccessToken, authRoutes);
app.get("*", (req, res) => {
    res.status(200).json({ message: "Invalid" });
});
initScheduledJobs();
httpServer.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
