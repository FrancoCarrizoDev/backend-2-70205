import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import logMiddleware from "./middlewares/logMiddleware.js";

const app = express();

// Iniciamos la conexión con MongoDB
const uri = "mongodb://127.0.0.1:27017/class-zero";
mongoose.connect(uri);

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true })); // Formatea query params de URLs para peticiones entrantes.
app.use(express.static("public")); // Sirve archivos estáticos desde la carpeta public.
app.use(logMiddleware);
app.use("/api/users", userRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Start Server in Port ${PORT}`);
});
