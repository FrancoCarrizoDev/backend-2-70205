import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import cookieRouter from "./routes/cookieRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import logMiddleware from "./middlewares/logMiddleware.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import userModel from "./models/userModel.js";
import authRouter from "./routes/authRouter.js";
import { isAuthenticated } from "./middlewares/auth.js";

const app = express();

const mongoAtlasUserCredentials = {
  user: "CoderUser",
  password: "iMvxMukyb7T7HxOb",
};

const mongoAtlasConnection = `mongodb+srv://${mongoAtlasUserCredentials.user}:${mongoAtlasUserCredentials.password}@coderhouse.beavt.mongodb.net/?retryWrites=true&w=majority&appName=coderhouse`;

// Iniciamos la conexión con MongoDB
mongoose.connect(mongoAtlasConnection);

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true })); // Formatea query params de URLs para peticiones entrantes.
app.use(express.static("public")); // Sirve archivos estáticos desde la carpeta public.
app.use(logMiddleware);
app.use(cookieParser());
app.use(
  session({
    secret: "supersecretodemongo",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoAtlasConnection,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 30,
    }),
  })
);

// Configuracion de handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.get("/", isAuthenticated, async (req, res) => {
  const user = await userModel.findById(req.session.userId).lean();
  console.log(user);
  res.render("home", {
    title: "Bienvenido",
    user,
  });
});

app.get("/login", (req, res) => {
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

app.use("/api/users", userRouter);
app.use("/api/cookies", cookieRouter);
app.use("/api/session", sessionRouter);
app.use("/api/auth", authRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Start Server in Port ${PORT}`);
});
