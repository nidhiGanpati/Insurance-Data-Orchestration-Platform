const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.get("/", (req, res) => res.redirect("/login"));

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/dashboard", authController.requireAuth, authController.getDashboard);
router.get("/logout", authController.logout);

// Keep a simple health endpoint at root as well
router.get("/health", (req, res) => {
  res.json({ message: "OK!", date: new Date().toISOString(), uptime: process.uptime() });
});

module.exports = router;
