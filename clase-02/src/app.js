import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import cookieRouter from "./routes/cookieRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import logMiddleware from "./middlewares/logMiddleware.js";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

// Iniciamos la conexión con MongoDB
const uri = "mongodb://127.0.0.1:27017/class-zero";
mongoose.connect(uri);

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true })); // Formatea query params de URLs para peticiones entrantes.
app.use(express.static("public")); // Sirve archivos estáticos desde la carpeta public.
app.use(logMiddleware);
app.use(cookieParser());

app.use(
  session({
    secret: "supersecreto",
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/api/users", userRouter);
app.use("/api/cookies", cookieRouter);
app.use("/api/session", sessionRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Start Server in Port ${PORT}`);
});

// s%3A4Z3hDDE3QjthY_fSW1m0yefwuTxczelI.LNsjEuLA%2Bl7UIL%2Fsu3pUmltwhQaC2zbaCV%2FUh%2FtHzFM
