import express, { json } from "express";
import cors from "cors";
import path from "path";
import os from "os";
import fs from "fs";
import uuid4 from "uuid4";
import fsAsync from "fs/promises";

const app = express();
const directory = path.join(os.homedir(), "Documents");

if (!fs.existsSync(directory)) {
  console.error(
    "You don't have Documents folder in your computer. Please make sure you have Documents folder in your computer."
  );
}

const tweetsDir = path.join(directory, "tweets");
const timelineFilePath = path.join(tweetsDir, "timeline.json");

if (!fs.existsSync(tweetsDir)) fs.mkdirSync(tweetsDir);

const corsOptions = {
  origin: ["http://localhost:3000/"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/tweets", (req, res) => {
  const username = req.query?.username;
  if (username) {
    const userFilePath = path.join(tweetsDir, username + ".json");
    fs.readFile(userFilePath, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        res
          .statusCode(500)
          .send(
            "파일을 읽어오는 도중 문제가 발생하였습니다. 다시 시도해주세요."
          );
      } else {
        res.status(200).send(data);
      }
    });
  } else {
    fs.readFile(timelineFilePath, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        res
          .statusCode(500)
          .send(
            "파일을 읽어오는 도중 문제가 발생하였습니다. 다시 시도해주세요."
          );
      } else {
        res.status(200).send(data);
      }
    });
  }
});

function UploadTweet(filePath, tweetObj) {
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) console.error(err);
      else {
        let curr = JSON.parse(data);
        curr.tweetList.push(tweetObj);
        fs.writeFile(filePath, JSON.stringify(curr), "utf-8", (err) => {
          console.error(err);
        });
      }
    });
  } else {
    let obj = {
      tweetList: [tweetObj],
    };
    let json = JSON.stringify(obj);
    fs.writeFile(filePath, json, "utf-8", (err) => {
      console.error(err);
    });
  }
}

app.post("/tweets", (req, res) => {
  const { username, tweet } = req.body;

  const newTweet = {
    username: username,
    tweet: tweet,
    id: uuid4(),
  };

  const userFilePath = path.join(tweetsDir, username + ".json");

  UploadTweet(timelineFilePath, newTweet);
  UploadTweet(userFilePath, newTweet);

  res.send("done");
});

app.delete("/tweets", async (req, res) => {
  try {
    const { id, username } = req.body;

    if (!id) {
      return res.status(400).send("Tweet ID is required");
    }

    const timelineData = await fsAsync.readFile(timelineFilePath, "utf-8");
    const timeline = JSON.parse(timelineData);

    const updatedTimeline = {
      ...timeline,
      tweetList: timeline.tweetList.filter((tweet) => tweet.id !== id),
    };

    await fsAsync.writeFile(
      timelineFilePath,
      JSON.stringify(updatedTimeline),
      "utf-8"
    );

    const userFilePath = path.join(tweetsDir, `${username}.json`);
    const userData = await fsAsync.readFile(userFilePath, "utf-8");
    const userTimeLine = JSON.parse(userData);

    const updatedUserTimeline = {
      ...userTimeLine,
      tweetList: userTimeLine.tweetList.filter((tweet) => tweet.id !== id),
    };

    await fsAsync.writeFile(
      userFilePath,
      JSON.stringify(updatedUserTimeline),
      "utf-8"
    );
    res.send("done");
  } catch (err) {
    console.error(err);
    res.status(500).send("Interval Server Error");
  }
});

app.put("/tweets/:id", (req, res) => {
  const { id } = req.params;
  const newTweet = req.body?.tweet;
  if (id) {
    fs.readFile(timelineFilePath, "utf-8", async (err, data) => {
      if (err) console.error(err);
      let curr = JSON.parse(data);
      let index = curr.tweetList.findIndex((x) => x.id === id);
      let prevTweet = curr.tweetList[index];
      console.log("prev", prevTweet);
      curr.tweetList.splice(index, 1, { ...prevTweet, tweet: newTweet });
      try {
        await fsAsync.writeFile(
          timelineFilePath,
          JSON.stringify(curr),
          "utf-8"
        ); //
        res.send("done");
      } catch (error) {
        console.error(error);
      }
    });
  } else {
    res.send("This tweet is not exist");
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong");
});

app.listen(8080);
