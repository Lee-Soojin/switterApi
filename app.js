import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { Server } from "socket.io";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

app.use(express.json());
app.use(cors(corsOption));

app.use((req, res) => {
  res.sendStatus(404);
});
app.use((error, req, res) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize.sync().then((client) => {
  const server = app.listen(config.host.port);
  initSocket(server);
});
