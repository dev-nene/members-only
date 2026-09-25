const { Router } = require("express");
const indexController = require("../controllers/indexController");
const validateUser = require("../validators/userValidator");
const passport = require("../config/passport");
const validateMessage = require("../validators/messageValidator");

const indexRouter = Router();

indexRouter.get("/", indexController.renderHomePage);

indexRouter.get("/users/sign-up", indexController.renderSignUpForm);
indexRouter.post("/users/sign-up", validateUser, indexController.signUpUser);
indexRouter.get("/users/log-in", indexController.renderLoginForm);
indexRouter.post(
  "/users/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/log-in",
    failureMessage: true,
  }),
);
indexRouter.get("/users/log-out", indexController.logOutUser);
indexRouter.get(
  "/users/club",
  indexController.requireLogin,
  indexController.renderClubForm,
);
indexRouter.post(
  "/users/club",
  indexController.requireLogin,
  indexController.addMembershipToUser,
);


indexRouter.get("/messages/new",indexController.requireLogin, indexController.renderMessageForm)
indexRouter.post("/messages/new", indexController.requireLogin, validateMessage, indexController.createMessage)

module.exports = indexRouter;
