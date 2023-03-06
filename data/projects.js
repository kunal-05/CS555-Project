const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;
const { ObjectId } = require("mongodb");
const validator = require("../helper");

const createProject = async (name, location, size, budget, username) => {
  const project = {
    name: name,
    location: location,
    size: size,
    budget: budget,
    username: username
  };
  const projectCollection = await projects();
  const insertInfo = await projectCollection.insertOne(project);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "Could not create the project";
const projectinfo = await getProjectById(insertInfo.insertedId.toString());
};

const getProjectById = async(id)=>{
    if (!validator.validString(id)) throw "id must be given";
    validator.validId(id);
    id = validator.trimString(id);
    const projectCollection = await projects();
    const project = await projectCollection.findOne({ _id: ObjectId(id) });
    if (!project) throw "Project with that id does not exist";
    return project;
}



module.exports = {
    createProject,
    getProjectById
}