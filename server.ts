require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const jobRoutes = require("./routes/job");
const autoRoutes = require("./routes/auto");

app.use("/api/v1/job/", jobRoutes);
app.use("/api/v1/auto/", autoRoutes);

type jsonType = {
  message: string;
};

app.get("*", (req: Request, res: Response) => {
  res.status(200).json({ message: "Invalid" });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
