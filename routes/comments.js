//comment routes
const express = require("express");
const router = express.Router();
const data = require("../data/");
const project = data.projects;
const commentData = data.comments;
const validation = require("../helper");
const xss = require("xss");
const ObjectID = require('mongodb').ObjectID
//import {ObjectId} from 'mongodb';
//const ObjectId = require("ObjectId")

router
  .route("/:projectId")
  .get(async (req, res) => {
    try {
      req.params.projectId = validation.validId(req.params.projectId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const projectId = req.params.projectId;
      await project.getProjectById(projectId);
    } catch (e) {
      return res.status(404).json({ error: "No project with id" });
    }
    try {
      const projectId = req.params.projectId;

      const comment = await commentData.getAllComments(projectId);
      res.status(200).json(comment);
    } catch (e) {
      res.status(404).json({ error: "No comment with id" });
    }
  })
  .post(async (req, res) => {
    let errors = [];
    if (req.session.user) {
      let commentInfo = req.body;
      if (!commentInfo) {
        errors.push("Comment text is empty");
      }
      if (
        !commentInfo.commentText ||
        typeof commentInfo.commentText != "string" ||
        commentInfo.commentText.trim().length == 0
      ) {
        errors.push("Comment text is invalid");
      }
      if (errors.length > 0) {
        return res.status(400).render("projects/index", {
          errors: errors,
          hasErrors: true,
        });
      }

      try {
        commentInfo.commentText = xss(
          validation.validString(commentInfo.commentText)
        );
        commentInfo.userId = validation.validId(req.session.user);
        var projectId = validation.validId(req.params.projectId);
        await project.getProjectById(projectId);
      } catch (e) {
        return res.status(404).json({ error: "No Project with id" });
      }
      try {
        const project = await commentData.createComment(
          projectId,
          commentInfo.userId,
          commentInfo.commentText.trim()
        );
        var allcomm = project["comments"];

        let lastelm = allcomm.slice(-1);

        return res.json({
          layout: null,
          projects: lastelm[0],
          userLoggedIn: true,
        })
      } catch (e) {
        return res
          .status(500)
          .render("error", { errors: e, hasErrors: true, userLoggedIn: true });
      }
    } else {
      res.redirect("/projects");
    }
  });

//to discuss whether needed
router
  .route("/comment/:projectId")
  .get(async (req, res) => {})
  .delete(async (req, res) => {});
module.exports = router;
