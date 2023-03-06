const userRoutes = require("./users.js");
const projectRoutes = require("./projects.js");
const taskRoutes = require("./tasks.js");
const express = require("express");
const router = express.Router();

const path = require("path");

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.sendFile(path.resolve("static/test-index.html"));
  });

  app.use("/", userRoutes);
  app.use("/projects", projectRoutes);
  app.use("/projects/tasks", taskRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
