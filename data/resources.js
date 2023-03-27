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
    const resourceCollection = await resources();
    const resource = await resourceCollection.findOne({ _id: new ObjectId(id) });
    if (!resource) throw "Resource with that id does not exist";
    return resource;
}

module.exports={
    createResource,
    getResourceById
}


