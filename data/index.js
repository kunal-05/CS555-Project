const projectData = require("./projects");
const taskData = require("./tasks");

const commentData = require("./comments");

const custProjects = require("./customerProject");
module.exports = {
  projects: projectData,
  tasks: taskData,
  custProjects: custProjects,
  comments: commentData
};

