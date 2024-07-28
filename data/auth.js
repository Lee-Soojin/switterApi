import { db } from "../db/database.js";

export async function getUser(username) {
  return db
    .execute("SELECT * FROM users WHERE username=?", [username])
    .then((result) => {
      return result[0][0];
    });
}

export async function findById(id) {
  return db
    .execute("SELECT * FROM users WHERE id =?", [id]) //
    .then((result) => {
      return result[0][0];
    });
}

export async function addUser(user) {
  const { username, password, name, email, url } = user;

  return db
    .execute(
      "INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)",
      [username, password, name, email, url]
    )
    .then((result) => {
      console.log(result);
      return result[0].insertId;
    });
}
