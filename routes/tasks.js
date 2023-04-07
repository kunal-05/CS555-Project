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
  req.params.id = validation.validId(req.params.id);

  const getPost = await posts.getPostById(req.params.id);
  const profilepicData = getPost.postPicture;
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
  const taskList = await tasks.getTaskById(id);
  return res.status(200).json(taskList);
});

router
  .route("/addTask")
  .post(upload.single("postPicture"), async (req, res) => {
    const body = req.body;
    let description = body.description;
    let start_date = body.start_date;
    let end_date = body.end_date;
    let task_members = body.task_members;
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
      start_date,
      end_date,
      task_members,
      project_id,
      finalImg
    );
    return res.status(200).json(taskList);
  });

module.exports = router;
