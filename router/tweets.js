import os from "os";
import fs from "fs";
import express from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";
import * as tweetController from "../controller/tweet.js";
import { body, param, validationResult } from "express-validator";
import { validate } from "../middleware/validate.js";

const tweetsRouter = express.Router();

tweetsRouter.use(cors());

const directory = path.join(os.homedir(), "Documents");

if (!fs.existsSync(directory)) {
  console.error(
    "You don't have Documents folder in your computer. Please make sure you have Documents folder in your computer."
  );
}

tweetsRouter.get("/", tweetController.getTweets);

tweetsRouter.get(
  "/:id",
  [
    param("id").notEmpty().withMessage("가져올 트윗의 아이디가 없습니다."),
    validate,
  ],
  tweetController.getTweet
);

tweetsRouter.post(
  "/",
  [
    body("username")
      .isLength({ min: 1 })
      .withMessage("유저 이름 데이터가 없습니다."),
    body("tweet")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Text should be at least 3 characters"),
    validate,
  ],
  tweetController.createTweet
);

tweetsRouter.delete(
  "/",
  [
    param("id").notEmpty().withMessage("삭제할 트윗의 아이디가 없습니다."),
    validate,
  ],
  tweetController.deleteTweet
);

tweetsRouter.put(
  "/:id",
  [
    param("id").notEmpty().withMessage("수정할 트윗의 아이디가 없습니다."),
    body("tweet").trim().notEmpty().withMessage("트윗 내용을 입력해주세요."),
    validate,
  ],
  tweetController.updateTweet
);

export default tweetsRouter;
