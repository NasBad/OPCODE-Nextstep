const express = require("express");
const router  = express.Router();
const { validateRegister, validateLogin } = require("../middleware/validate.middleware");

// TODO: implement auth controllers
// POST /api/auth/register
router.post("/register", validateRegister, (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

// POST /api/auth/login
router.post("/login", validateLogin, (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

module.exports = router;
