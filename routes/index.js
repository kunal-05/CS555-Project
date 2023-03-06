const userRoutes = require("./users.js");
const projectRoutes = require("./projects.js");
const express = require("express");
// module.exports = router;
const router = express.Router();

const path = require("path");

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.sendFile(path.resolve("static/test-index.html"));
  });

  app.use("/", userRoutes);
  app.use("/projects", projectRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
