import { getUsers } from "../database/database.js";
import MongoDb from "mongodb";

const ObjectId = MongoDb.ObjectId;

export async function getUser(username) {
  const usersCollection = await getUsers();
  return usersCollection
    .findOne({ username })
    .then(mapOptionalUser)
    .catch(console.error);
}

export async function findById(id) {
  const usersCollection = await getUsers();
  return usersCollection
    .findOne({ _id: new ObjectId(id) })
    .then(mapOptionalUser)
    .catch(console.error);
}

export async function addUser(user) {
  const usersCollection = await getUsers();
  return usersCollection
    .insertOne(user) //
    .then((data) => data.insertedId.toString());
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id } : user;
}
