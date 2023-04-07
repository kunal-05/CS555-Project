const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const { ObjectId } = require("mongodb");
const validator = require("../helper");

const createTask = async (
  description,
  start_date,
  end_date,
  task_members,
  project_id,
  postPicture
) => {
  if (!postPicture || postPicture == "") {
    postPicture = "";
  }
  const task = {
    description: description,
    start_date: start_date,
    end_date: end_date,
    task_members: task_members,
    project_id: project_id,
    postPicture: postPicture,
  };
  const taskCollections = await tasks();
  const insertInfo = await taskCollections.insertOne(task);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "Could not create the task for the given project";
  const taskInfo = await getTaskById(insertInfo.insertedId.toString());
  return taskInfo;
};

const getTaskById = async (id) => {
  if (!validator.validString(id)) throw "id must be given";
  validator.validId(id);
  id = validator.trimString(id);
  const taskCollections = await tasks();
  const task = await taskCollections.findOne({ _id: ObjectId(id) });
  if (!task) throw "task with that id does not exist";
  return task;
};

const getTaskByProjectId = async (project_id) => {
  if (!validator.validString(project_id)) throw "id must be given";
  validator.validId(project_id);
  project_id = validator.trimString(project_id);
  const taskCollections = await tasks();
  const task = await taskCollections.findOne({
    project_id: ObjectId(project_id),
  });
  if (!task) throw "task with that project_id does not exist";
  return task;
};

module.exports = {
  createTask,
  getTaskById,
  getTaskByProjectId,
};
