const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const users = data.users;
const posts = data.posts;
const bcrypt = require("bcryptjs");
const userData = mongoCollections.users;
const saltRounds = 10;
const validator = require("../helper");
const xss = require("xss");


// GET METHOD for /login route
router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/posts");
    
  } else {
    return res.render("login", { userLoggedIn: false });
  }
});
//POST METHOD for /login route
router.post("/login", async (req, res) => {
    const emailId = validator.trimString(req.body.emailId);
    const password = req.body.password;
    let errors = [];
    try {
      if (!validator.validEmail(emailId)) {
        errors.push("Email id cannot be empty");
      }
    } catch (e) {
      errors.push("Email id cannot be empty");
    }
  
    if (!password) {
      errors.push("Password cannot be empty");
    }
    if (errors.length > 0) {
      return res.status(400).render("login", {
        errors: errors,
        hasErrors: true,
        userLoggedIn: false,
      });
    }
    //if (!validator.validPassword(password)) errors.push("Invalid password.");
    const userCollection = await userData();
    const myUser = await userCollection.findOne({
      emailId: emailId.toLowerCase(),
    });
  
    if (!myUser) errors.push("Emailid or password does not match.");
    if (errors.length > 0) {
      return res.status(401).render("login", {
        errors: errors,
        hasErrors: true,
        userLoggedIn: false,
      });
    }

    
    // const hashedPassword = await bcrypt.hash(myUser.password, saltRounds);
  
    // let match = await bcrypt.compare(password,hashedPassword);

    let match = await bcrypt.compare(password,myUser.password);
  
    if (match) {
      req.session.user = myUser._id.toString();
      // Redirect the user to their previous route after thsey login if it exists
      // Otherwise, bring them to the home/post list page
      let prev = req.session.previousRoute;
      if (prev) {
        req.session.previousRoute = "";
        // return res.redirect(prev);
      }
      return res.redirect("/posts");
      //res.status(200).json(myUser);
      // res.render('posts/index');
    } else {
      errors.push("Emailid or password does not match");
      return res.status(401).render("login", {
        errors: errors,
        hasErrors: true,
        userLoggedIn: false,
      });
    }
  });

  module.exports = router;