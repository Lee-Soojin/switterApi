import uuid4 from "uuid4";
import * as userRepository from "./auth.js";
let tweets = [];

export async function getAll() {
  return Promise.all(
    tweets.map(async (tweet) => {
      const { username, name, url } = await userRepository.findById(
        tweet.userId
      );
      return { ...tweet, username, name, url };
    })
  );
}

export async function getAllByUserName(username) {
  return tweets.filter((x) => x.username === username);
}
export async function getById(id) {
  const found = tweets.find((tweet) => tweet.id === id);
  if (!found) {
    return null;
  }
  const { username, name, url } = await userRepository.findById(found.userId);
  return { ...found, username, name, url };
}
export async function create(text, username) {
  const newTweet = {
    tweet: text,
    uploadDate: new Date().toString(),
    id: uuid4(),
    username,
  };
  tweets = [newTweet, ...tweets];
  return tweets;
}

export async function update(id, text) {
  const tweet = tweets.find((x) => x.id === id);
  if (tweet) tweet.tweet = text;
  return tweet;
}

export async function remove(id) {
  tweets = tweets.filter((x) => x.id !== id);
}
