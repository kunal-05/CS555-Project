const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const projects = mongoCollections.projects;
const { ObjectId } = require("mongodb");
const validator = require("../helper");

const createTask = async (description, task_status, task_members,project_id) => {
  const task = {
    description: description,
    task_members: task_members,
    task_status: task_status,
    project_id: project_id
  };
  const taskCollections = await tasks();
  const insertInfo = await taskCollections.insertOne(task);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "Could not create the task for the given project";
const taskInfo = await getTaskById(insertInfo.insertedId.toString());
const projectCollection = await projects();
const updateInfo = await projectCollection.updateOne(
  { _id: new ObjectId(project_id) },
  { $push: { tasks: taskInfo } }
);
return project_id
};

const getTaskById = async(id)=>{
    if (!validator.validString(id)) throw "id must be given";
    validator.validId(id);
    id = validator.trimString(id);
    const taskCollections = await tasks();
    const task = await taskCollections.findOne({ _id: new ObjectId(id) });
    if (!task) throw "task with that id does not exist";
    return task;
}

const getTaskByProjectId = async(project_id)=>{
  if (!validator.validString(project_id)) throw "id must be given";
  validator.validId(project_id);
  project_id = validator.trimString(project_id);
  const taskCollections = await tasks();
  const task = await taskCollections.findOne({ project_id: new ObjectId(project_id) });
  if (!task) throw "task with that project_id does not exist";
  return task;
}



module.exports = {
    createTask,
    getTaskById,
    getTaskByProjectId
}