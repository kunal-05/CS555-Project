const express = require("express");
const { ObjectId } = require("mongodb");
// const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const custProjects = data.custProjects;
const validator = require("../helper");

// router.get("/", async (req, res) => {
//   if (req.session.user) {
//     try {
//       const allProject = await projects.getProjectsByUserId(req.session.user);
//       return res.render("projects/index", {
//         allProject: allProject,
//         userLoggedIn: true,
//       });
//     } catch (e) {
//       return res.json({ ERROR: e });
//     }
//   }
//   // const projectList = await projects.getProjectById(id);
//   // return res.status(200).json(projectList);
// });

router.get("/addCustProject", async (req, res) => {
  // if (req.session.user) {
  console.log("in cust form");
  res.render("projects/customerProject");
  // } else {
  // res.redirect("/login");
  // }
});
router.post("/addCustProject", async (req, res) => {
  const body = req.body;
  console.log(body);
  let name = body.name;
  let location = body.location;
  let size = body.size;
  // let budget = body.budget;
  // let owner = req.session.user;
  // let status = body.status;

  const projectList = await custProjects.createCustomerRequest(
    name,
    location,
    size
    // budget,
    // owner,
    // status
  );
  return res.status(200).json(projectList);
});

// router.get("/:id", async (req, res) => {
//   const id = req.params.id;
//   const projectList = await projects.getProjectById(id);
//   return res.status(200).json(projectList);
// });

module.exports = router;
