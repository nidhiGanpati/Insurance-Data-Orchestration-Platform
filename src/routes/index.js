const express = require("express");
const router = express.Router();

const webRoutes = require("./web.route");
const planRoutes = require("./plan.route");
const rootRoutes = require("./root.route");

// Web UI (login + dashboard)
router.use("/", webRoutes);

// Minimal API (optional)
router.use("/api", rootRoutes);
router.use("/api/plan", planRoutes);

module.exports = router;
