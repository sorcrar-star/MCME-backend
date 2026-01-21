const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }

  const data = fs.readFileSync(USERS_FILE, "utf-8");
  const json = JSON.parse(data);
  return json.users || [];
}

function writeUsers(users) {
  const data = {
    users
  };
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  readUsers,
  writeUsers
};
