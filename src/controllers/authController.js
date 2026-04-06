const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readStore } = require("../services/storeService");

async function login(req, res) {
  const { email, password } = req.body;
  const store = readStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) return res.status(401).json({ message: "Invalid credentials." });
  if (user.status !== "active") return res.status(403).json({ message: "User is inactive." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials." });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, status: user.status },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
  });
}

module.exports = { login };
