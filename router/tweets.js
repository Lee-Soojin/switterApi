import os from "os";
import fs from "fs";
import express from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";
import { body, param } from "express-validator";
import * as tweetController from "../controller/tweet.js";
import { validate } from "../middleware/validate.js";
import { isAuth } from "../middleware/auth.js";

// validation
// sanitization
// Contract Testing: Client-Server

const tweetsRouter = express.Router();

tweetsRouter.use(cors());

const directory = path.join(os.homedir(), "Documents");

if (!fs.existsSync(directory)) {
  console.error(
    "You don't have Documents folder in your computer. Please make sure you have Documents folder in your computer."
  );
}

const validateTweet = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Text should be at least 3 characters"),
  validate,
];

tweetsRouter.get("/", isAuth, tweetController.getAllTweets);

tweetsRouter.get("/:username", isAuth, tweetController.getTweetsByUserId);

tweetsRouter.get(
  "/:id",
  [
    param("id").notEmpty().withMessage("가져올 트윗의 아이디가 없습니다."),
    validate,
  ],
  tweetController.getTweet
);

tweetsRouter.post("/", isAuth, validateTweet, tweetController.createTweet);

tweetsRouter.delete("/", isAuth, tweetController.deleteTweet);

tweetsRouter.put("/", isAuth, validateTweet, tweetController.updateTweet);

export default tweetsRouter;
