import uuid4 from "uuid4";

let tweets = [];

export function getAll() {
  return tweets;
}
export function getAllByUserName(username) {
  return tweets.filter((x) => x.username === username);
}
export function getAllById(id) {
  return tweets.find((x) => x.id === id);
}
export function create(text, username) {
  const newTweet = {
    tweet: text,
    username: username,
    uploadDate: new Date().toString(),
    id: uuid4(),
  };
  tweets = [newTweet, ...tweets];
  return tweets;
}

export function update(text, id) {
  const tweet = tweets.find((x) => x.id === id);
  if (tweet) tweet.tweet = text;
  return tweet;
}

export function remove(id) {
  tweets = tweets.filter((x) => x.id !== id);
}
