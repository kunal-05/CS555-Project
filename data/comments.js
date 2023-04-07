// all comments data
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const validation = require("../helper");
const userData = require("./users");

const users = mongoCollections.users;
const projects = mongoCollections.projects;

const createComment = async (projectId, userId, commentText) => {

  if (!validation.validId(projectId)) throw "projectId must be given as a string";
  if (!validation.validString(userId)) throw "userId must be given as a string";
  if (!validation.validString(commentText))
    throw "must give comment text as a string";

  const projectCollections = await projects();
  const sameProject = await projectCollections.findOne({
    _id: new ObjectId(projectId),
  });

  if (sameProject === null) throw "Project to which comment added doesnt exist";
  let u = await userData.getUserById(userId)
  userId = u.firstName+" "+u.lastName
  let newComment = {
    
    _id: new ObjectId(),

    userId: userId ,
    commentText: commentText,
  };
  //const postsCollection = await posts();

  //Add the comment id to the review
  const updatedInfo = await projectCollections.updateOne(
    { _id: new ObjectId(projectId) },
    { $push: { comments: newComment } }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update Project Collection with comment Data!";
  }
  //Add the comment id to the user
  // const updatedInfo2 = await usersCollection.updateOne({ _id: objIdForUser }, { $push: { commentIds: String(newComment._id) } });
  // if (updatedInfo2.modifiedCount === 0) {
  //     throw 'Could not update Users Collection with Review Data!';
  // }

  // const newId = insertInfo.insertedId;
  const project = await projectCollections.findOne({ _id: new ObjectId(projectId) });
  if (project === null) throw "No movie found with that id";

  project._id = project._id.toString();
  return project;
};

const getComment = async (id) => {
  if (!validation.validString(id)) throw "id must be given";
  if (typeof id === "string") id = ObjectId.createFromHexString(id);
  let resultData = {};
  const projectsCollection = await projects();
  const project = await projectsCollection.find({}).toArray();

  if (project === null) throw "No review present with that Id";

  project.forEach((element) => {
    element.comments.forEach((data) => {
      if (data._id.toString() === id) {
        resultData = {
          _id: data._id,
          userName: data.userName,

          commentText: data.commentText,
        };
      }
    });
  });
  resultData._id = resultData._id.toString();
  return resultData;
};

const getAllComments = async (projectId) => {
  if (!validation.validString(projectId)) throw "id must be given";

  const projectsCollection = await posts();
  const project = await projectsCollection.findOne({ _id: ObjectId(projectId) });
  if (project === null) throw "No project present with that Id";

  project.comments.forEach((element) => {
    element._id = element._id.toString();
  });
  return project.comments;
};

const removeComment = async (commentId) => {
  commentId = validation.validId(commentId);

  try {
    const projectCollection = await projects();
    var projectId=''
    const project = await projectCollection.find({}).toArray();
    if (project === null)
      throw "project you are trying to remove a review for does not exist";
      project.forEach((element) => {
      element.comments.forEach((data) => {
        if (data._id.toString() === commentId) {
           projectId = element._id;
        }
      });
    });
    const removeComment = await projectCollection.updateOne(
      {},
      { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );

    if (!removeComment.matchedCount && !removeComment.modifiedCount)
      throw [400, "Removal of comment has failed"];
    const updatedPost = await projectCollection.findOne({
      _id:new ObjectId(projectId),
    });

    return updatedPost;
  } catch (e) {
    throw "Could not Delete Comment from Review while Deleting Comment!";
  }
};

module.exports = {
  removeComment,
  getAllComments,
  getComment,
  createComment,
};
