const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../data/users.json");

function readUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data).users;
}

function saveUsers(users) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify({ users }, null, 2)
  );
}

function findUserByEmail(email) {
  const users = readUsers();
  return users.find(u => u.email === email);
}

function createUser(userData) {
  const users = readUsers();
  users.push(userData);
  saveUsers(users);
}

module.exports = {
  readUsers,
  findUserByEmail,
  createUser
};
