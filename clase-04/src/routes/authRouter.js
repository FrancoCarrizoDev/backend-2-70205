import { Router } from "express";
import { isNotAuthenticated } from "../middlewares/auth.js";
import userModel from "../models/userModel.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/login", isNotAuthenticated, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).lean();

    if (!user) {
      req.session.error = "Credenciales incorrectas";
      return res.redirect("/login");
    }

    if (!isValidPassword(password, user.password)) {
      req.session.error = "Credenciales incorrectas 2";
      return res.redirect("/login");
    }

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

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failAuth",
  }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect("/");
  }
);

router.get("/failAuth", (req, res) => {
  res.send("Error en la autenticación");
});

export default router;
