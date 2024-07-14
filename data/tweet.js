import uuid4 from "uuid4";
import * as userRepository from "./auth.js";
let tweets = [];

export async function getAll() {
  return Promise.all(
    tweets.map(async (tweet) => {
      const { username, name, url, image } = await userRepository.findById(
        tweet.userId
      );
      return { ...tweet, username, name, url, image };
    })
  );
}

export async function getAllByUserId(userId) {
  return tweets.filter((x) => x.userId === userId);
}
export async function getById(id) {
  const found = tweets.find((tweet) => tweet.id === id);
  if (!found) {
    return null;
  }
  const { username, name, image } = await userRepository.findById(found.userId);
  console.log({ ...found, username, name, image });
  return { ...found, username, name, image };
}
export async function create(text, userId) {
  const newTweet = {
    tweet: text,
    uploadDate: new Date().toString(),
    id: uuid4(),
    userId,
  };
  tweets = [newTweet, ...tweets];
  return tweets;
}

export async function update(id, text) {
  const tweet = tweets.find((x) => x.id === id);
  if (tweet) tweet.tweet = text;
  const index = tweets.findIndex((x) => x.id === id);
  tweets.splice(index, 1, tweet);
  return getById(tweet.id);
}

export async function remove(id) {
  tweets = tweets.filter((x) => x.id !== id);
}
