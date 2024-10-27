import { Router } from "express";
import { isNotAuthenticated } from "../middlewares/auth.js";
import userModel from "../models/userModel.js";
const router = Router();

router.post("/login", isNotAuthenticated, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email, password });

    req.session.userId = user._id;
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
