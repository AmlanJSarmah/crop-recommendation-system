// Constants
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-ALlow-Headers", "Content-Type, Authorization");
  next();
});

// App Routes
app.use((req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(8080);
