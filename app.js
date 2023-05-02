const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const H = require("just-handlebars-helpers");
const Handlebars = require("handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  partialsDir: ["views/partials/"],
});
// app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
H.registerHelpers(Handlebars);

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string",
    resave: false,
    saveUninitialized: true,
  })
);

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
