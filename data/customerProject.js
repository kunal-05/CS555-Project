const mongoCollections = require("../config/mongoCollections");
const custProjects = mongoCollections.custProjects;
const { ObjectId } = require("mongodb");
const validator = require("../helper");

// add request table - reqId and custId
const createCustomerRequest = async (userId) => {
  const customerRequest = {
    userId: userId,
  };
  const projectCollection = await custProjects();
  const insertInfo = await projectCollection.insertOne(customerRequest);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "Could not create the project";
  let newId = insertInfo.insertedId;
  const projectinfo = await getProjectById(newId.toString());
  return projectinfo;
};

// add request table - reqId and custId

const getProjectById = async (id) => {
  if (!validator.validString(id)) throw "id must be given";
  validator.validId(id);
  id = validator.trimString(id);
  const projectCollection = await custProjects();
  const project = await projectCollection.findOne({ _id: new ObjectId(id) });
  if (!project) throw "Project with that id does not exist";
  return project;
};

// add request table - reqId and custId
const getProjectsByUserId = async (id) => {
  if (!validator.validString(id)) throw "id must be given";
  validator.validId(id);
  id = validator.trimString(id);
  const projectCollection = await custProjects();
  const project = await projectCollection.find({ userId: id }).toArray();
  if (!project) throw "Project with that id does not exist";
  return project;
};

//get all requests
const getAllRequest = async()=>{
  const projectCollection = await custProjects();
  const project = await projectCollection.find({}).toArray();
  return project
}

module.exports = {
  createCustomerRequest,
  getProjectById,
  getProjectsByUserId,
  getAllRequest
};
