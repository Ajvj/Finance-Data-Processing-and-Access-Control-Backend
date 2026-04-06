const bcrypt = require("bcryptjs");
const { readStore, writeStore, nextId } = require("../services/storeService");

async function createUser(req, res) {
  const { name, email, password, role, status } = req.body;
  const store = readStore();
  const duplicate = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (duplicate) return res.status(409).json({ message: "Email already exists." });

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: nextId(store.users),
    name,
    email,
    passwordHash,
    role,
    status,
    createdAt: new Date().toISOString()
  };
  store.users.push(newUser);
  writeStore(store);
  return res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status
  });
}

function listUsers(req, res) {
  const store = readStore();
  const users = store.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt
  }));
  return res.json(users);
}

function updateUserRole(req, res) {
  const userId = Number(req.params.id);
  const { role } = req.body;
  const store = readStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  user.role = role;
  writeStore(store);
  return res.json({ message: "Role updated.", user: { id: user.id, role: user.role } });
}

function updateUserStatus(req, res) {
  const userId = Number(req.params.id);
  const { status } = req.body;
  const store = readStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  user.status = status;
  writeStore(store);
  return res.json({ message: "Status updated.", user: { id: user.id, status: user.status } });
}

module.exports = {
  createUser,
  listUsers,
  updateUserRole,
  updateUserStatus
};
