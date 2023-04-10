const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
//const projects = data.projects;
const multer = require("multer");
const path = require("path");

const tasks = data.tasks;
const validator = require("../helper");
var fs = require("fs");

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

router.get("/postpic/:id", async (req, res) => {
  let errors = [];
  if (
    !req.params.id ||
    typeof req.params.id != "string" ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  req.params.id = validator.validId(req.params.id);

  const getTask = await tasks.getTaskById(req.params.id);
  const profilepicData = getTask.postPicture;
  if (profilepicData == "") {
    errors.push("No Post Pic Found!");

    return res.status(400).send({
      message: "No Post Pic Found!",
    });
  } else {
    res.contentType("image/jpeg");
    res.send(profilepicData.image.buffer);
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const task = await tasks.getTaskById(id);
  return res.status(200).json(task);
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const taskList = await tasks.getTaskByProjectId(id);
  // return res.status(200).json(taskList);
  if (req.session.user) {
    try {
      return res.render("projects/tasks", {
        tasks: taskList,
        userLoggedIn: true,
        identity: req.session.identity,
      });
    } catch (e) {
      return res.json({ ERROR: e });
    }
  }
});
router
  .route("/addTask")
  .post(upload.single("postPicture"), async (req, res) => {
    const body = req.body;

    let description = body.description;
    let task_members = body.task_members;
    let task_status = body.task_status;
    let project_id = body.project_id;

    var finalImg = "";

    if (!req.file) {
      finalImg = "";
    } else {
      var img = fs.readFileSync(req.file.path);
      var encode_image = img.toString("base64");
      finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(encode_image, "base64"),
      };
    }

    const taskList = await tasks.createTask(
      description,
      task_status,
      task_members,
      project_id,
      finalImg
    );
    return res.status(200).json(taskList);
  });

module.exports = router;
