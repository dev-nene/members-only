const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function signUpUser(first_name, last_name, username, password_hash) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password_hash) VALUES ($1, $2, $3, $4)",
    [first_name, last_name, username, password_hash],
  );
}

module.exports = {
  getAllMessages,
  signUpUser,
};
