import os from "os";
import fs from "fs";
import express from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";
import * as tweetRepository from "../data/tweet.js";

const tweetsRouter = express.Router();

tweetsRouter.use(cors());

const directory = path.join(os.homedir(), "Documents");

if (!fs.existsSync(directory)) {
  console.error(
    "You don't have Documents folder in your computer. Please make sure you have Documents folder in your computer."
  );
}

tweetsRouter.get("/", (req, res) => {
  const username = req.query?.username;

  const data = username
    ? tweetRepository.getAllByUserName(username)
    : tweetRepository.getAll();
  res.status(200).json(data);
});

tweetsRouter.get("/:id", (req, res) => {
  const id = req.params?.id;
  const data = tweetRepository.getAllById(id);
  if (data) res.status(200).json(data);
  else
    res
      .status(404)
      .json({ message: "해당 아이디를 가진 트윗이 존재하지 않습니다." });
});

tweetsRouter.post("/", (req, res) => {
  const { username, tweet } = req.body;
  const newTweet = tweetRepository.create(tweet, username);
  res.status(201).json(newTweet);
});

tweetsRouter.delete("/", async (req, res) => {
  const { id } = req.body;
  tweetRepository.remove(id);
  res.sendStatus(204);
});

tweetsRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const text = req.body?.tweet;
  const newTweet = tweetRepository.update(text, id);
  if (newTweet) {
    res.status(200).json(newTweet);
  } else {
    res.status(404).json({ message: "트윗 수정에 실패하였습니다." });
  }
});

export default tweetsRouter;
