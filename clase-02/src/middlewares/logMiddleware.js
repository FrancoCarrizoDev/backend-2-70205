function logMiddleware(req, res, next) {
  console.log(
    "Se ha hecho una petición de tipo " +
      req.method +
      "  a la ruta /user a las",
    new Date()
  );
  next();
}

export default logMiddleware;
