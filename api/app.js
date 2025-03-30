// Constants
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const stateRoutes = require("./routes/stateRoutes");

// Middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-ALlow-Headers", "Content-Type, Authorization");
  next();
});

// App Routes
app.use(stateRoutes);

mongoose
  .connect("mongodb://localhost:27017/cropRecommendation")
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.error(err);
  });
