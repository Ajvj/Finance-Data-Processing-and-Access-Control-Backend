const bcrypt = require("bcryptjs");
const { readStore, writeStore, nextId } = require("./storeService");

async function ensureDefaultAdmin() {
  const store = readStore();
  const existingAdmin = store.users.find((user) => user.role === "admin");
  if (existingAdmin) return;

  const passwordHash = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
  store.users.push({
    id: nextId(store.users),
    name: "System Admin",
    email: process.env.DEFAULT_ADMIN_EMAIL,
    passwordHash,
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString()
  });
  writeStore(store);
}

module.exports = { ensureDefaultAdmin };
