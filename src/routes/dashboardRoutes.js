const express = require("express");
const { getSummary, getTrends } = require("../controllers/dashboardController");
const { authMiddleware, requireRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware, requireRoles("viewer", "analyst", "admin"));
router.get("/summary", getSummary);
router.get("/trends", getTrends);

module.exports = router;
