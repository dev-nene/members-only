const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");

async function renderHomePage(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { messages });
}

module.exports = {
  renderHomePage,
};
