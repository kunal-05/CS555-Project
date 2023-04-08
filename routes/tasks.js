const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
//const projects = data.projects;
const tasks = data.tasks;
const validator = require("../helper");



router.get("/:id", async (req, res) => {
  const id = req.params.id
  const taskList = await tasks.getTaskById(id);
  return res.status(200).json(taskList);
});

router.post("/addTask", async (req, res) => {
    const body = req.body
    let description = body.description
    let task_members = body.task_members
    let task_status = body.task_status
    let project_id = body.project_id
  const taskList = await tasks.createTask(
    description,
    task_status,
    task_members,
    project_id

  );
  console.log(taskList)
  return res.redirect("/projects/"+taskList);
});

module.exports = router;