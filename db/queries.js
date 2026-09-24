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

async function findUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
}

async function findUserById(id) {
  const { rows } = await pool.query(
    "SELECT id, first_name, last_name, username, membership_status, admin_status FROM users WHERE id = $1",
    [id],
  );
  return rows[0];
}

module.exports = {
  getAllMessages,
  signUpUser,
  findUserByUsername,
  findUserById,
};
