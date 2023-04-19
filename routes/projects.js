const express = require("express");
const { ObjectId } = require("mongodb");
// const { projects } = require("../config/mongoCollections");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const moment = require("moment")
const data = require("../data/");
const projects = data.projects;
const resources = require("../data/resources");
const validator = require("../helper");

router.get("/", async (req, res) => {
  if (req.session.user) {
    try {
      const allProject = await projects.getProjectsByUserId(req.session.user);
      return res.render("projects/index", {
        allProject: allProject,
        userLoggedIn: true,
        identity: req.session.identity,
      });
    } catch (e) {
      return res.json({ ERROR: e });
    }
  }
  // const projectList = await projects.getProjectById(id);
  // return res.status(200).json(projectList);
});
router.get("/resources",async(req,res)=>{
  const allResource = await resources.getAllResources();
  return res.json(allResource)

})

router.get("/resourcesPage",async(req,res)=>{
  if (req.session.user) {
    try {
      const allResource = await resources.getAllResources();
      return res.render("resource", {
        allResource: allResource,
        userLoggedIn: true,
        identity: req.session.identity,
      });
    } catch (e) {
      return res.json({ ERROR: e });
    }
  }

})

router.get("/addProject", async (req, res) => {
  if (req.session.user) {
    res.render("projects/createProject", { userLoggedIn: true });
  } else {
    res.redirect("/login");
  }
});
router.post("/addProject", async (req, res) => {
  const body = req.body;
  console.log(body);
  let name = body.name;
  let location = body.location;
  let size = body.size;
  let budget = body.budget;
  let owner = req.session.user;
  let startdate = body.startdate;
  let endate = body.endate;
  let task_members = body.task_members;
  let request_id = body.request_id;
  let resources = body.resource;
  name = validator.validString(name)
  location = validator.validString(location)
  size = validator.validString(size)
  owner = validator.validId(owner)
  request_id = validator.validId(request_id)
  if (!moment(startdate, 'MM/DD/YYYY',true).isValid()){
    throw "Not valid date format (mm/dd/yyyy)"
  }
  if (!moment(endate, 'MM/DD/YYYY',true).isValid()){
    throw "Not valid date format (mm/dd/yyyy)"
  }
  const projectList = await projects.createProject(
    name,
    location,
    size,
    budget,
    owner,
    startdate,
    endate,
    task_members,
    request_id,
    resources
  );
  console.log(projectList)
  return res.redirect("/projects");
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  //const projectList = await projects.getProjectById(id);
  let userId = req.session.user;
  let canComment = false;

  if (userId) {
    try {
      let canComment = true;

      const id = req.params.id;
      const projectList = await projects.getProjectById(id);

      res.render("projects/projectDetails", {
        projects: projectList,
        canComment: canComment,
        userLoggedIn: true,
        hasErrors: true,
      });
    } catch (e) {
      return res
        .status(500)
        .render("error", { errors: e, userLoggedIn: true, hasErrors: true });
    }
  } else {
    return res.redirect("/login");
  }
  //return res.status(200).json(projectList);
});



module.exports = router;
