import express, { json } from "express";
import cors from "cors";
import path from "path";
import os from "os";
import fs from "fs";

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
  const username = req.params?.username;

  if (username) {
    console.log("params username", username);
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
  };

  const userFilePath = path.join(tweetsDir, username + ".json");

  UploadTweet(timelineFilePath, newTweet);
  UploadTweet(userFilePath, newTweet);

  res.send("done");
});

app.listen(8080);
