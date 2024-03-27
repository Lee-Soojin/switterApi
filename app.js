import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000/"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.listen(8080);
