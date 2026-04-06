const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "..", "data", "store.json");

function readStore() {
  if (!fs.existsSync(storePath)) {
    const initial = { users: [], records: [] };
    fs.writeFileSync(storePath, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  const raw = fs.readFileSync(storePath, "utf8");
  return raw ? JSON.parse(raw) : { users: [], records: [] };
}

function writeStore(data) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf8");
}

function nextId(list) {
  if (!list.length) return 1;
  return Math.max(...list.map((item) => item.id)) + 1;
}

module.exports = {
  readStore,
  writeStore,
  nextId
};
