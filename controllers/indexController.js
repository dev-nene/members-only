const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");

async function renderHomePage(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { messages });
}

async function renderSignUpForm(req, res) {
  res.render("sign-up", { errors: [], user: {} });
}

async function signUpUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("sign-up", { errors: errors.array(), user: req.body });
    return;
  }

  const categoryData = matchedData(req);

  const password_hash = await bcrypt.hash(categoryData.password, 10);

  await db.signUpUser(
    categoryData.first_name,
    categoryData.last_name,
    categoryData.username,
    password_hash,
  );

  res.redirect("/users/log-in");
}

module.exports = {
  renderHomePage,
  renderSignUpForm,
  signUpUser,
};
