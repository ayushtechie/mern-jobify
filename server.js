import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// Router
import authRouter from "./routes/authRouter.js";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";
// Middleware
import errorHandlerMiddleware from "./middleware/errorhandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

//public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

// app.post("/", (req, res) => {
//   console.log(req);
//   res.json({ message: "data received", data: req.body });
// });

// app.post(
//   "/api/v1/test",
//   [body("name").notEmpty().withMessage("name is required")],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorMessages = errors.array().map((error) => error.msg);
//       return res.status(400).json({ errors: errorMessages });
//     }
//     next();
//   },
//   (req, res) => {
//     const { name } = req.body;
//     res.json({ msg: `hello ${name}` });
//   }
// );


app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
})


app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server is running on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
