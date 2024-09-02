import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const userSchema = Mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

// _id -> id

useVirtualId(userSchema);
const User = Mongoose.model("User", userSchema);

export async function getUser(username) {
  return User.findOne({ username });
}

export async function findUserById(id) {
  return User.findById(id);
}

export async function addUser(user) {
  return new User(user).save().then((data) => data.id);
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
