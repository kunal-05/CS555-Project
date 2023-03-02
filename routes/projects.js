const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const projects = data.projects;
const validator = require("../helper");



router.get("/:id", async (req, res) => {
    const id = req.params.id
  const projectList = await projects.getProjectById(id);
  return res.status(200).json(projectList);
});

router.post("/addProject", async (req, res) => {
    const body = req.params.body
    let name = body.name
    let location= body.location
    let size = body.size
    let budget = body.budget
    let owner = req.session.user
    let status = req.params.status
  const projectList = await projects.createProject(
    name,
    location,
    size,
    budget,
    owner,
    status

  );
  return res.status(200).json(projectList);
});
