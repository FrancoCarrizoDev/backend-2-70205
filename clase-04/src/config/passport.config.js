import passport from "passport";
import local from "passport-local";
import userModel from "../models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (user) {
            return done(null, false, { message: "User already exists" });
          }

          const { name, age, email, password } = req.body;

          const newUser = new userModel({
            email,
            age,
            name,
            password: createHash(password),
          });

          const result = await userModel.create(newUser);

          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findOne({ _id: id });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
