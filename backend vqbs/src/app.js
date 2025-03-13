import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

const app = express();


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/uploads/questions', express.static(path.join(process.cwd(), 'uploads/questions')));

//routes import
import userRouter from "./routes/user.router.js";
import questionRoutes from "./routes/question.router.js";
import addusersRouter from "./routes/addusers.router.js";
import practiceRouter from "./routes/practice.router.js";
import subjectRouter from './routes/subject.router.js';
import topicRouter from './routes/topic.router.js';
import examRouter from './routes/exam.router.js';
import messageRoutes from './routes/message.router.js';
import notificationRoutes from './routes/notification.router.js';


//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/questions", questionRoutes);
app.use('/api/v1/addusers',addusersRouter);
app.use('/api/v1/practice', practiceRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/exams', examRouter);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/notifications', notificationRoutes);


app.get("/", (_req, res) => {
  res.send("Welcome to the Virtual Question Bank System API");
});

export { app };
