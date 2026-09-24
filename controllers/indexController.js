const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");

async function renderHomePage(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { messages, user: req.user });
}

async function renderSignUpForm(req, res) {
  res.render("sign-up", { errors: [], user: {} });
}

async function signUpUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("sign-up", { errors: errors.array(), user: req.body });
    return;
  }

  const categoryData = matchedData(req);

  const password_hash = await bcrypt.hash(categoryData.password, 10);

  try {
    await db.signUpUser(
      categoryData.first_name,
      categoryData.last_name,
      categoryData.username,
      password_hash,
    );
  } catch (error) {
    if (error.code === "23505") {
      return res.render("sign-up", {
        errors: [{ msg: "Username is already taken" }],
        user: {},
      });
    }
  }

  res.redirect("/users/log-in");
}

function renderLoginForm(req, res) {
  const messages = req.session.messages ?? [];
  req.session.messages = [];

  res.render("log-in", {
    errors: messages.map((msg) => ({ msg })),
    user: {},
  });
}

async function logOutUser(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = {
  renderHomePage,
  renderSignUpForm,
  signUpUser,
  renderLoginForm,
  logOutUser,
};
