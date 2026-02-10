const express = require("express");
const router = express.Router();

// API health endpoint
router.get("/health", (req, res) => {
  res.json({ message: "OK!", date: new Date().toISOString(), uptime: process.uptime() });
});

module.exports = router;
