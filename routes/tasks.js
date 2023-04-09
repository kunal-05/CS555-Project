const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
//const projects = data.projects;
const tasks = data.tasks;
const multer = require("multer");
const validator = require("../helper");

const path = require("path");

var fs = require("fs");
const { users } = require("../config/mongoCollections");
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

router.get("/:id", async (req, res) => {
  const id = req.params.id
  const taskList = await tasks.getTaskById(id);
  return res.status(200).json(taskList);
});

router.route("/addTask").post(upload.single("postpic"), async (req, res) => {
    const body = req.body
    let description = body.description
    let task_members = body.task_members
    let task_status = body.task_status
    let project_id = body.project_id
    var finalimg = ""

    if (!req.file) {
      finalimg = "";
    } else {
      var img = fs.readFileSync(req.file.path);
      var encode_image = img.toString("base64");
      finalimg = {
        contentType: req.file.mimetype,
        image: Buffer.from(encode_image, "base64"),
      };
    }

  const taskList = await tasks.createTask(
    description,
    task_status,
    task_members,
    project_id,
    finalimg
  );
  console.log(taskList)
  return res.redirect("/projects/"+taskList);
});

module.exports = router;