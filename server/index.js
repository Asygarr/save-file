import express from "express";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import UserRoute from "../routes/user.routes.js";
import AuthUser from "../routes/auth.routes.js";
import PostRoute from "../routes/post.routes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      secure: "auto",
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(UserRoute);
app.use(AuthUser);
app.use(PostRoute);

app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
);
