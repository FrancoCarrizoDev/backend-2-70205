import { Router } from "express";

const router = Router();

router.get("/getCookies", async (req, res) => {
  try {
    console.log(req.cookies);
    return res.send({
      status: "success",
      message: "Cookies read",
      data: req.cookies,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/setCookies", async (req, res) => {
  const { name, email } = req.body;
  try {
    res.cookie("name", name);
    res.cookie("email", email);
    res.send({
      status: "success",
      message: "Cookies set",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
