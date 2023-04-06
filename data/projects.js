const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;
const { ObjectId } = require("mongodb");
const validator = require("../helper");
const resource = require("./resources")

const createProject = async (name, location, size, budget, owner,start_date,end_date,task_members,request_id,resources) => {
  
  if(!Array.isArray(task_members)){
    task_members = [task_members]
  }
  task_members.push(owner)
  const project = {
    name: name,
    location: location,
    size: size,
    budget: budget,
    owner: owner,
    status: "In Progress",
    comments:[],
    start_date: start_date,
    end_date: end_date,
    task_members: task_members,
    resources_info:[],
    request_id: request_id,
    resource:resources,
    tasks:[]
  };
  const projectCollection = await projects();
  const insertInfo = await projectCollection.insertOne(project);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "Could not create the project";
let newId=insertInfo.insertedId;
const projectinfo = await getProjectById(newId.toString());
return projectinfo
};

const getProjectById = async(id)=>{
    if (!validator.validString(id)) throw "id must be given";
    validator.validId(id);
    id = validator.trimString(id);
    const projectCollection = await projects();
    const project = await projectCollection.findOne({ _id: new ObjectId(id) });
    if (!project) throw "Project with that id does not exist";
    if(project.length!=0){
      for (i=0;i<project["resource"].length; i++){
        console.log(project["resource"][i])
        project["resource"][i] = await resource.getResourceById(project["resource"][i])
      }
    }
    return project;
}

const getProjectsByUserId = async(id)=>{
  // if (Object)
  if (!validator.validString(id)) throw "id must be given";
    validator.validId(id);
    id = validator.trimString(id);
    const projectCollection = await projects();
    const project = await projectCollection.find({task_members:{$in:[id]}}).toArray();
    if (!project) throw "Project with that id does not exist";
    return project;

}

const getProjectsByRequestId = async(id)=>{
  if (!validator.validString(id)) throw "id must be given";
    validator.validId(id);
    id = validator.trimString(id);
    const projectCollection = await projects();
    const project = await projectCollection.findOne({ request_id: new ObjectId(id) });
    if (!project) throw "Project with that request_id does not exist";
    return project;

}


module.exports = {
    createProject,
    getProjectById,
    getProjectsByUserId,
    getProjectsByRequestId
}