const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const users = require("../data/users");
const posts = data.posts;
const bcrypt = require("bcryptjs");
const userData = mongoCollections.users;
const saltRounds = 10;
const validator = require("../helper");
const xss = require("xss");
//POST METHOD for /register route
router.post("/register", async (req, res) => {
  let errors = [];
  let firstName = xss(validator.trimString(req.body.firstName));
  let lastName = xss(validator.trimString(req.body.lastName));
  let emailId = xss(validator.trimString(req.body.emailId).toLowerCase());
  let password = xss(req.body.password);
  let age = xss(req.body.age);
  let phoneNumber = xss(validator.trimString(req.body.phoneNumber));
  let address = xss(validator.trimString(req.body.Address));
  let identity = req.body.identity;

  if (
    !validator.validStringBool(firstName) ||
    !validator.validName(firstName)
  ) {
    errors.push("Please Enter valid First Name");
  }
  if (!validator.validStringBool(lastName) || !validator.validName(lastName)) {
    errors.push("Please Enter valid Last Name");
  }
  if (!validator.validEmail(emailId)) {
    errors.push("Please Enter valid email id");
  }
  if (!validator.validPassword(password)) {
    errors.push("Please enter valid password");
  }
  // if (typeof address === "string") {
  //   address = parseInt(age);
  // }

  if (errors.length > 0) {
    return res.status(400).render("register", {
      authenticated: false,
      title: "Register",
      errors: errors,
      hasErrors: true,
    });
  }

  const allUsers = await users.getAllUsers();
  if (allUsers.length !== 0) {
    allUsers.forEach((user) => {
      if (user.emailId === validator.trimString(emailId)) {
        errors = [];
        errors.push("An account is already created with the given email id");
      }
    });
    if (errors.length > 0) {
      return res.status(400).render("register", {
        authenticated: false,
        title: "Register",
        errors: errors,
        hasErrors: true,
      });
    }
  }

  try {
    const user = await users.createUser(
      firstName,
      lastName,
      emailId,
      password,
      phoneNumber,
      address,
      identity
    );

    return res.redirect("/login");
  } catch (e) {
    res.status(500).render("error", { userLoggedIn: false });
  }
});
// GET METHOD for /register route
router.get("/register", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/projects");
  } else {
    return res.render("register", { userLoggedIn: false, register: true });
  }
});

// GET METHOD for /login route
router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/projects");
  } else {
    return res.render("login", { userLoggedIn: false });
  }
});
//POST METHOD for /login route
router.post("/login", async (req, res) => {
  const emailId = validator.trimString(req.body.emailId);
  const password = req.body.password;
  const iden = req.body.identity;
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
  if(myUser.identity!==iden){
    errors.push("Incorrect access")
  }

  if (!myUser) errors.push("Emailid or password does not match.");
  if (errors.length > 0) {
    return res.status(401).render("login", {
      errors: errors,
      hasErrors: true,
      userLoggedIn: false,
      //boolean to check identity
    });
  }

  let match = await bcrypt.compare(password, myUser.password);

  if (match) {
    req.session.user = myUser._id.toString();
    req.session.identity = req.body.identity;
    // if (req.body.identity === "admin") {
    //   return res.redirect("/");
    // }
    // if (req.body.identity === "employee") {
    console.log(req.session.identity)
    return res.redirect("/projects");
    // }
    // return res.redirect("/cust/addCustProject");
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

router.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.redirect("/");
});
//GET METHOD for myProfle route
router.get("/myProfile", async (req, res) => {
  if (req.session.user) {
    try {
      const userInfo = await users.getUserById(req.session.user);
      // return res.status(200).json(userInfo);
      return res.render("profile", {
        userInfo: userInfo,
        userLoggedIn: true,
        
      });
    } catch (e) {
      return res.status(500).render("error", { errors: e, userLoggedIn: true, identity:req.session.identity });
    }
  } else {
    return res.redirect("/login");
  }
});
router.get("/allEmployees",async(req,res)=>{
  const allEmployees = await users.getAllEmployees("employee");
  return res.json(allEmployees)

})
module.exports = router;
