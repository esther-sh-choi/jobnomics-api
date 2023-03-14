require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const restaurantApiRoutes = require("./routes/restaurant-api");
const customerApiRoutes = require("./routes/customer-api");

app.use("/api/restaurant", restaurantApiRoutes);
app.use("/api/customer", customerApiRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
