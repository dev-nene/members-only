const { Router } = require("express");
const indexController = require("../controllers/indexController");
const validateUser = require("../validators/userValidator");

const indexRouter = Router();

indexRouter.get("/", indexController.renderHomePage);

indexRouter.get("/users/sign-up", indexController.renderSignUpForm);
indexRouter.post("/users/sign-up",validateUser, indexController.signUpUser);

module.exports = indexRouter;
