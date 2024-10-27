import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    if (req.session.count) {
      req.session.count++;
      res.send(
        `Bienvenido ${req.session.name} visitaste el sitio ${req.session.count} veces`
      );
    } else {
      const { name } = req.query;
      req.session.count = 1;
      req.session.name = name;

      res.send(`Bienvenido ${name} visitaste el sitio por primera vez`);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
