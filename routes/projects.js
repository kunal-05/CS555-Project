const express = require("express");
const { ObjectId } = require("mongodb");
// const { projects } = require("../config/mongoCollections");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const projects = data.projects;
const validator = require("../helper");

router.get("/", async (req, res) => {

if (req.session.user){
  try{
  const allProject = await projects.getProjectsByUserId  (req.session.user)
  return res.render("projects/index", { allProject: allProject, userLoggedIn: true });
  }
  catch(e){
    return res.json({"ERROR":e})
  }
}
// const projectList = await projects.getProjectById(id);
// return res.status(200).json(projectList);
});


router.get("/addProject", async (req, res) => {
  if (req.session.user) {
    res.render("projects/createProject", { userLoggedIn: true });
  } else {
    res.redirect("/login");
  }
});
router.post("/addProject", async (req, res) => {
    const body = req.body
    console.log(body)
    let name = body.name
    let location= body.location
    let size = body.size
    let budget = body.budget
    let owner = req.session.user
    let status = body.status
  const projectList = await projects.createProject(
    name,
    location,
    size,
    budget,
    owner,
    status

  );
  return res.redirect("/projects")
});

router.get("/:id", async (req, res) => {
  const id = req.params.id
const projectList = await projects.getProjectById(id);
return res.status(200).json(projectList);
});

module.exports = router;