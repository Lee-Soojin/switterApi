import { getSocketIO } from "../connection/socket.js";
import * as tweetRepository from "../data/tweet.js";

export async function getAllTweets(req, res) {
  const data = await tweetRepository.getAll();
  res.status(200).json(data);
}

export async function getTweetsByUserId(req, res) {
  const userId = req.query?.userId;
  const data = await (userId
    ? tweetRepository.getAllByUserId(userId)
    : tweetRepository.getAll());

  res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params?.id;
  const data = await tweetRepository.getById(id);
  if (data) res.status(200).json(data);
  else
    res
      .status(404)
      .json({ message: "해당 아이디를 가진 트윗이 존재하지 않습니다." });
}

export async function createTweet(req, res) {
  const { tweet } = req.body;
  const newTweet = await tweetRepository.create(tweet, req.userId);

  getSocketIO().emit("update", newTweet[0]);

  res.status(201).json(newTweet);
}

export async function updateTweet(req, res) {
  const { id } = req.params;
  const text = req.body?.tweet;
  const tweet = await tweetRepository.getById(id);

  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.update(id, text);
  getSocketIO().emit("update", updated);

  res.status(200).json(updated);
}

export async function deleteTweet(req, res) {
  const { id } = req.body;
  const tweet = tweetRepository.getById(id);

  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.id) {
    return res.sendStatus(403);
  }

  await tweetRepository.remove(id);
  getSocketIO().emit("update", "Done");

  res.sendStatus(204);
}
