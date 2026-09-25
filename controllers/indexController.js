const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");
require("dotenv").config();

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
    return next(error);
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

async function renderClubForm(req, res) {
  res.render("club-form", { errors: [] });
}

async function addMembershipToUser(req, res) {
  const clubSecret = process.env.clubSecret;

  if (!clubSecret) {
    throw new Error("Club passcode is not configured");
  }

  if (
    typeof req.body.passcode === "string" &&
    req.body.passcode === clubSecret
  ) {
    await db.addMembershipToUser(req.user.id);
    return res.redirect("/");
  }

  return res.render("club-form", {
    errors: [{ msg: "Incorrect code" }],
  });
}

async function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/users/log-in");
  }
  next();
}

async function requireAdmin(req, res, next) {
  if (!req.user.admin_status) {
    return res.redirect("/");
  }
  next();
}

async function renderMessageForm(req, res) {
  res.render("message-form", { errors: [] });
}

async function createMessage(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("message-form", { errors: errors.array() });
    return;
  }

  const messageData = matchedData(req);

  await db.createMessage(messageData.title, messageData.text, req.user.id);

  res.redirect("/");
}

async function deleteMessage(req, res) {
  await db.deleteMessage(req.params.id);
  res.redirect("/")
}

module.exports = {
  renderHomePage,
  renderSignUpForm,
  signUpUser,
  renderLoginForm,
  logOutUser,
  renderClubForm,
  addMembershipToUser,
  requireLogin,
  renderMessageForm,
  createMessage,
  requireAdmin,
  deleteMessage,
};
