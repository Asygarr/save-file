import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from "../routes/UserRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
);
