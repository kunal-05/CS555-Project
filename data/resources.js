const mongoCollections = require("../config/mongoCollections");
const resources = mongoCollections.resources;
const { ObjectId } = require("mongodb");
const validator = require("../helper");

const createResource = async (name, count, cost) => {
  const resource = {
    name: name,
    count: count,
    cost: cost,
  };
  const resourceCollection = await resources();
  const insertInfo = await resourceCollection.insertOne(resource);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "Could not create the resource";
  let newId = insertInfo.insertedId;
  const resourceInfo = await getResourceById(newId.toString());
  return resourceInfo;
};

const getResourceById = async(id)=>{
    if (!validator.validString(id)) throw "id must be given";
    validator.validId(id);
    id = validator.trimString(id);
    console.log(id)
    const resourceCollection = await resources();
    const resource = await resourceCollection.findOne({ _id: new ObjectId(id) });
    if (!resource) throw "Resource with that id does not exist";
    console.log(resource)
    return resource.name;
}

const getAllResources = async () => {
  const resourceCollection = await resources();
  const resource = await resourceCollection.find({}).toArray();
  if (!resource) throw "No resource found";
  return resource;
};

const updateResources = async (res)=>{
  const resourceCollection = await resources();
  if (!Array.isArray(res)) {
    res = [res];
  }
  for(let r in res){
    const resource = await resourceCollection.findOne({_id:new ObjectId(res[r])});
    resource.count = resource.count - 1
    const updateResource = await resourceCollection.updateOne(
      { _id: new ObjectId(resource._id) },
      { $set: resource }
    );
    if (updateResource.modifiedCount === 0 && updateResource.deletedCount === 0){
      throw "could not update resource";
    }
  }
  return 
  }
  




module.exports={
    createResource,
    getResourceById,
    getAllResources,
    updateResources
}


