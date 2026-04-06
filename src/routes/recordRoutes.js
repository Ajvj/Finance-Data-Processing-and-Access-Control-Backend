const express = require("express");
const { z } = require("zod");
const { createRecord, listRecords, updateRecord, deleteRecord } = require("../controllers/recordController");
const { authMiddleware, requireRoles } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(2),
  date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  notes: z.string().max(500).optional()
});

const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().min(2).optional(),
  date: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  notes: z.string().max(500).optional()
});

router.use(authMiddleware);
router.get("/", requireRoles("viewer", "analyst", "admin"), listRecords);
router.post("/", requireRoles("admin"), validate(createRecordSchema), createRecord);
router.patch("/:id", requireRoles("admin"), validate(updateRecordSchema), updateRecord);
router.delete("/:id", requireRoles("admin"), deleteRecord);

module.exports = router;
