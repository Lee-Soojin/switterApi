import { db } from "../db/database.js";

const SELECT_JOIN =
  "SELECT tw.id, tw.tweet, tw.createdAt, tw.userId, us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId=us.id";
const ORDER_DESC = "ORDER BY tw.createdAt DESC";

export async function getAll() {
  return db
    .execute(`${SELECT_JOIN} ${ORDER_DESC}`) //
    .then((result) => result[0]);
}

export async function getAllByUserId(userId) {
  return db
    .execute(`${SELECT_JOIN} WHERE us.id=? ${ORDER_DESC}`, [userId]) //
    .then((result) => result[0]);
}
export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id]) //
    .then((result) => result[0][0]);
}
export async function create(text, userId) {
  return db
    .execute("INSERT INTO tweets (tweet, createdAt, userId) VALUES(?,?,?)", [
      text,
      new Date(),
      userId,
    ]) //
    .then((result) => getById(result[0].insertId));
}

export async function update(id, text) {
  return db
    .execute("UPDATE tweets SET tweet=? WHERE id=?", [text, id]) //
    .then((result) => getById(id));
}

export async function remove(id) {
  return db.execute("DELETE FROM tweets WHERE id=?", [id]);
}
