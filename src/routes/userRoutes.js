const express = require("express");
const { z } = require("zod");
const { createUser, listUsers, updateUserRole, updateUserStatus } = require("../controllers/userController");
const { authMiddleware, requireRoles } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["viewer", "analyst", "admin"]),
  status: z.enum(["active", "inactive"]).default("active")
});

const updateRoleSchema = z.object({
  role: z.enum(["viewer", "analyst", "admin"])
});

const updateStatusSchema = z.object({
  status: z.enum(["active", "inactive"])
});

router.use(authMiddleware, requireRoles("admin"));
router.get("/", listUsers);
router.post("/", validate(createUserSchema), createUser);
router.patch("/:id/role", validate(updateRoleSchema), updateUserRole);
router.patch("/:id/status", validate(updateStatusSchema), updateUserStatus);

module.exports = router;
