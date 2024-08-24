import MongoDb from "mongodb";
import { config } from "../config.js";

let db;

export async function connectDB() {
  return MongoDb.MongoClient.connect(config.db.host).then((client) => {
    db = client.db();
    return db;
  });
}

export async function getUsers() {
  return db.collection("users");
}

export async function getTweets() {
  return db.collection("tweets");
}
