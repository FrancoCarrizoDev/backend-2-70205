import { Router } from "express";
import userModel from "../models/userModel.js";
import { createHash } from "../utils.js";

const router = Router();

// Consultar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const result = await userModel.find();
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

// Crear un usuario
router.patch("/recovery-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.redirect("/login");
    }

    const newPasswordUser = {
      password: createHash(password),
    };

    await userModel.updateOne(
      {
        email,
      },
      newPasswordUser
    );

    req.session.feedback = "Password actualizada";
    res.redirect("/login");
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// Crear un usuario
router.post("/", async (req, res) => {
  const { name, age, email, password } = req.body;
  try {
    const passwordHash = createHash(password);
    const result = await userModel.create({
      name,
      age,
      email,
      password: passwordHash,
    });
    req.session.userId = result._id;
    res.redirect("/");
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// Actualizar un usuario
router.put("/:uid", async (req, res) => {
  const uid = req.params.uid;
  const { name, age, email } = req.body;
  try {
    const user = await userModel.findOne({ _id: uid });
    if (!user) throw new Error("User not found");

    const newUser = {
      name: name ?? user.name,
      age: age ?? user.age,
      email: email ?? user.email,
    };

    await userModel.updateOne(
      {
        email,
      },
      newUser
    );
    res.send({
      status: "success",
      payload: updateUser,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// Eliminar un usuario
router.delete("/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const result = await userModel.deleteOne({ _id: uid });
    res.status(200).send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const uid = req.params.id;
  try {
    const result = await userModel.findOne({ _id: uid });
    if (!result) throw new Error("User not found");
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
