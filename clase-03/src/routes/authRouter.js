import { Router } from "express";
import userModel from "../models/userModel.js";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email, password });

    if (!user) {
      req.session.error = "Credenciales inválidas";
      res.redirect("/login");
      return;
    }

    req.session.userId = user._id;
    req.session.error = null;
    res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    req.session.error = "Error en el servidor";
    res.redirect("/login");
  }
});

router.post("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default router;
