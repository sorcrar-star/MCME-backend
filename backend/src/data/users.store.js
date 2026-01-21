const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return { users: [] };
  }

  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsers(data) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  readUsers,
  writeUsers
};
