const express = require("express");
const { ObjectId } = require("mongodb");
// const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const custProjects = data.custProjects;
const validator = require("../helper");

router.get("/", async (req, res) => {
  if (req.session.user) {
    try {
      const allRequest = await custProjects.getAllRequest();
      return res.json(allRequest)
      // return res.render("home", {
      //   userLoggedIn: true,
      //   identity: req.session.identity
      // });
    } catch (e) {
      return res.json({ ERROR: e });
    }
  }
  // const projectList = await projects.getProjectById(id);
  // return res.status(200).json(projectList);
});

router.get("/addCustProject", async (req, res) => {
  // if (req.session.user) {
  console.log("in cust form");
  res.render("projects/customerProject",{ userLoggedIn: true });
  // } else {
  // res.redirect("/login");
  // }
});
router.post("/addCustProject", async (req, res) => {
  const userId = req.session.user;
  console.log(userId);
  const projectList = await custProjects.createCustomerRequest(userId);
  return res.render("home",{ userLoggedIn: true });
});

// router.get("/:id", async (req, res) => {
//   const id = req.params.id;
//   const projectList = await projects.getProjectById(id);
//   return res.status(200).json(projectList);
// });

module.exports = router;
