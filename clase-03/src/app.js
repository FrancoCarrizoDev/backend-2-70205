import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import cookieRouter from "./routes/cookieRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import logMiddleware from "./middlewares/logMiddleware.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import userModel from "./models/userModel.js";
import authRouter from "./routes/authRouter.js";
import { isAuthenticated, isNotAuthenticated } from "./middlewares/auth.js";

const app = express();

const mongoAtlasUri = `mongodb+srv://test:test1234@coderhouse.beavt.mongodb.net/?retryWrites=true&w=majority&appName=coderhouse`;

// const fileStore = FileStore(session);
// Iniciamos la conexión con MongoDB
// const uri = "mongodb://127.0.0.1:27017/class-zero";
mongoose.connect(mongoAtlasUri);

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
    store: MongoStore.create({
      mongoUrl: mongoAtlasUri,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      //ttl: 15, // tiempo de vida de la sesión en segundos y lo mismo para FileStorage
    }),
  })
);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.get("/", isAuthenticated, async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.userId });

  if (!user) {
    return res.redirect("/login");
  }

  const { name } = user;
  console.log({ user });
  res.render("home", {
    title: "Bienvenido",
    user: {
      name,
      role: req.session.role,
    },
  });
});

app.get("/login", isNotAuthenticated, (req, res) => {
  if (req.session.error) {
    res.render("login", {
      title: "Error - Iniciar Sesión",
      layout: "login",
      error: {
        message: req.session.error,
        count: req.session.countError,
      },
    });
    req.session.error = null;
    return;
  }
  res.render("login", {
    title: "Iniciar Sesión",
    layout: "login",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    title: "Registrarse",
    layout: "login",
  });
});

app.get("/profile", isAuthenticated, async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.userId }).lean();

  if (!user) {
    return res.redirect("/login");
  }

  const { name } = user;
  res.render("profile", {
    title: "Perfil",
    user: {
      name,
    },
  });
});

app.use("/api/users", userRouter);
app.use("/api/cookies", cookieRouter);
app.use("/api/session", sessionRouter);
app.use("/api/auth", authRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Start Server in Port ${PORT}`);
});

// s%3A4Z3hDDE3QjthY_fSW1m0yefwuTxczelI.LNsjEuLA%2Bl7UIL%2Fsu3pUmltwhQaC2zbaCV%2FUh%2FtHzFM
