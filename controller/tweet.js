import * as tweetRepository from "../data/tweet.js";

export async function getAllTweets(req, res) {
  const data = tweetRepository.getAll();
  res.status(200).json(data);
}

export async function getTweetsByUsername(req, res) {
  const username = req.query?.username;

  const data = await (username
    ? tweetRepository.getAllByUserName(username)
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
  const { username, tweet } = req.body;
  const newTweet = await tweetRepository.create(tweet, username);
  res.status(201).json(newTweet);
}

export async function updateTweet(req, res) {
  const { id } = req.params;
  const text = req.body?.tweet;
  const newTweet = await tweetRepository.update(id, text);
  if (newTweet) {
    res.status(200).json(newTweet);
  } else {
    res.status(404).json({ message: "트윗 수정에 실패하였습니다." });
  }
}

export async function deleteTweet(req, res) {
  const { id } = req.body;
  await tweetRepository.remove(id);
  res.sendStatus(204);
}
