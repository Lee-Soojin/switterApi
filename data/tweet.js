import uuid4 from "uuid4";

let tweets = [];

export async function getAll() {
  return tweets;
}
export async function getAllByUserName(username) {
  return tweets.filter((x) => x.username === username);
}
export async function getAllById(id) {
  return tweets.find((x) => x.id === id);
}
export async function create(text, username) {
  const newTweet = {
    tweet: text,
    username: username,
    uploadDate: new Date().toString(),
    id: uuid4(),
  };
  tweets = [newTweet, ...tweets];
  return tweets;
}

export async function update(text, id) {
  const tweet = tweets.find((x) => x.id === id);
  if (tweet) tweet.tweet = text;
  return tweet;
}

export async function remove(id) {
  tweets = tweets.filter((x) => x.id !== id);
}
