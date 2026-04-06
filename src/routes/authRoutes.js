const express = require("express");
const { z } = require("zod");
const { login } = require("../controllers/authController");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/login", validate(loginSchema), login);

module.exports = router;
