//user routes

const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const validator = require("../helper");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const createUser = async (
  firstName,
  lastName,
  emailId,
  password,
  phoneNumber,
  address,
  identity
) => {
  if (!validator.validStringBool(firstName) || !validator.validName(firstName))
    throw "First name is not a valid string.";
  if (!validator.validStringBool(lastName) || !validator.validName(lastName))
    throw "Last name is not a valid string.";
  if (!validator.validEmail(emailId)) throw "Email is not a valid string.";
  let email = emailId.toLowerCase();

  
  if (!validator.validPassword(password))
    throw "Password is not a valid string.";
  validator.validatePhoneNumber(phoneNumber);

  /*before storing email and username into DB, make sure there are no duplicate entries of email in DB */
  const allUsers = await getAllUsers();
  if (allUsers.length !== 0) {
    allUsers.forEach((user) => {
      if (user.emailId === validator.trimString(email))
        throw "An account is already created with the provided email id.";
    });
  }
  //create hashed password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  firstName = validator.trimString(firstName);
  lastName = validator.trimString(lastName);
  emailId = validator.trimString(email);
  phoneNumber = validator.trimString(phoneNumber);
  identity = validator.trimString(identity);

  address = validator.trimString(address);
  
  /* Add new user to DB */
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    emailId: emailId.toLowerCase(),
    password: hashedPassword,
    phoneNumber: phoneNumber,
    address: address,
    identity: identity
  };

  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user.";

  const newId = insertInfo.insertedId;
  const userDetail = await getUserById(newId.toString());

  return userDetail;
};

const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (userList.length === 0) return [];
  return userList;
};

const getUserById = async (id) => {
  if (!validator.validString(id)) throw "id must be given";
  validator.validId(id);
  id = validator.trimString(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw "user with that id does not exist";
  return user;
};

const updateUser = async (id, updatedUser) => {
  let updatedUserData = {};
  if (!validator.validString(id)) throw "id must be given";
  id = validator.validId(id);
  id = validator.trimString(id);
  // let = await getUserById(id);
  if (updatedUser.firstName) {
    if (
      !validator.validStringBool(updatedUser.firstName) ||
      !validator.validName(updatedUser.firstName)
    )
      throw "First name is not a valid string.";
    updatedUser.firstName = validator.trimString(updatedUser.firstName);
    updatedUserData.firstName = updatedUser.firstName;
  }
  if (updatedUser.lastName) {
    if (
      !validator.validStringBool(updatedUser.lastName) ||
      !validator.validName(updatedUser.lastName)
    )
      throw "Last name is not a valid string.";
    updatedUser.lastName = validator.trimString(updatedUser.lastName);
    updatedUserData.lastName = updatedUser.lastName;
  }

  if (updatedUser.phoneNumber) {
    validator.validatePhoneNumber(updatedUser.phoneNumber);
    updatedUser.phoneNumber = validator.trimString(updatedUser.phoneNumber);
    updatedUserData.phoneNumber = updatedUser.phoneNumber;
  }

  if (updatedUser.address) {
    if (!validator.validStringBool(updatedUser.address))
      throw "Address is not a valid string.";
    updatedUser.address = validator.trimString(updatedUser.address);
    updatedUserData.address = updatedUser.address;
  }

 

  // if (updatedUser.preference.length < 0) {
  //   throw `There should be atleast one preference`;
  // }


  const updateInfoUser = await userCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedUserData }
  );
  if (updateInfoUser.modifiedCount === 0 && updateInfoUser.deletedCount === 0)
    throw "could not update user";
  return await getUserById(id);
};

const getAllEmployees = async (identity) => {
  const userCollection = await users();
  const user = await userCollection.find({ identity: identity }).toArray();
  if (!user) throw "No users found";
  return user;
};



module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  getAllEmployees
};
