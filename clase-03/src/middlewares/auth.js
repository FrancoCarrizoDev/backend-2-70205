// middleware/auth.js
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }

  req.session.error = "Debes iniciar sesión";
  res.redirect("/login");
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  req.session.error = "Ya iniciaste sesión";

  res.redirect("/");
};

export { isAuthenticated, isNotAuthenticated };
