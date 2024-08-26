import { getTweets } from "../database/database.js";
import * as authRepository from "../data/auth.js";
import { ObjectId } from "mongodb";

export async function getAll() {
  const tweetsCollection = await getTweets();
  return tweetsCollection
    .find()
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

export async function getAllByUsername(username) {
  const tweetsCollection = await getTweets();

  return tweetsCollection
    .find({ username })
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets)
    .catch(console.error);
}

export async function getById(id) {
  const tweetsCollection = await getTweets();

  return tweetsCollection
    .findOne({ _id: new ObjectId(id) })
    .then((data) => {
      return data;
    })
    .catch(console.error);
}

export async function create(text, userId) {
  const { name, username, url } = await authRepository.findById(userId);
  const tweetsCollection = await getTweets();
  const tweet = {
    text,
    createdAt: new Date(),
    userId,
    name,
    username,
    url,
  };

  try {
    const data = await tweetsCollection.insertOne(tweet);
    const newTweet = mapOptionalTweet({ ...tweet, _id: data.insertedId });
    return mapOptionalTweet(newTweet);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function update(id, text) {
  const tweetsCollection = await getTweets();

  tweetsCollection
    .findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          text,
        },
      },
      {
        returnDocument: "after",
      }
    )
    .then((result) => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
  const tweetsCollection = await getTweets();
  return tweetsCollection
    .deleteOne({ _id: new ObjectId(id) })
    .catch(console.error);
}

function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

function mapTweets(tweets) {
  return tweets.map(mapOptionalTweet);
}
