import os from "os";
import fs from "fs";
import express from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";
import { body, param } from "express-validator";
import * as authController from "../controller/auth.js";
import { validate } from "../middleware/validate.js";
import { isAuth } from "../middleware/auth.js";

function validatePassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

function validateUsername(username) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(username);
}

function validateEmailAddress(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

const validateCredential = [
  body("username")
    .trim()
    .isLength({ min: 5 })
    .withMessage("아이디는 5자 이상이어야 합니다."),
  body("passsword")
    .trim()
    .isEmpty()
    .withMessage("비밀번호는 8자 이상이어야 합니다."),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("이름을 입력해주세요."),
  body("email").isEmail().withMessage("유효한 이메일 주소를 입력해주세요."),
  body("url")
    .isURL()
    .withMessage("유효한 URL을 입력해주세요.")
    .optional({ nullable: this, checkFalsy: true }),
  validate,
];

// settings

const authRouter = express.Router();

authRouter.use(cors());

// sign up

authRouter.post("/signup", validateSignup, authController.signUp);

// login

authRouter.post("/login", validateCredential, authController.signIn);

// get user info

authRouter.get("/me", isAuth, authController.me);

authRouter.get("/profile/:userId", isAuth, authController.profile);

export default authRouter;
