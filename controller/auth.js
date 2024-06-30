import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.js";

const jwtSecretKey = `P8+rk]N/WyY49\X9g9)I7D+E`;
const jwtExpiresInDays = "2d";
const bcryptSaltRounds = 12;

function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}

export async function signUp(req, res) {
  const { username, name, password, url, email } = req.body;
  const found = await authRepository.getUser(username);
  if (found) {
    return res
      .status(409)
      .json({ message: `${username}로 가입된 이력이 존재합니다.` });
  }
  const hashed = await bcrypt.hash(password, bcryptSaltRounds);
  const userId = await authRepository.addUser({
    username,
    password: hashed,
    name,
    url,
    email,
  });
  const token = createJwtToken(userId);
  res.status(201).json({ token, username });
}

export async function signIn(req, res) {
  const { username, password } = req.body;
  const user = await authRepository.getUser(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return res.status(401).json({ message: "Invalid user or password" });
  const token = createJwtToken(user.id);
  res.status(200).json({ token, username });
}

export async function getUserInfo(req, res) {
  let data = authRepository.getUser(req.username);
  if (data) {
    res.status(200).json(data);
  } else res.status(400).json({ message: "잘못된 접근입니다." });
}

export async function me(req, res, next) {
  const user = await authRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
