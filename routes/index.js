const userRoutes = require("./users.js");
const projectRoutes = require("./projects.js");
const taskRoutes = require("./tasks.js");
const commentRoutes = require("./comments.js");
const express = require("express");
const router = express.Router();
const custRoute = require("./customerProject");
const path = require("path");

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.sendFile(path.resolve("static/test-index.html"));
  });

  app.use("/", userRoutes);
  app.use("/projects", projectRoutes);
  app.use("/projects/tasks", taskRoutes);
  app.use("/cust", custRoute);
  app.use("/comments", commentRoutes);
  app.use("/cust", custRoute);


  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
