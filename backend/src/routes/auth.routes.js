const express = require("express");
const router  = express.Router();
const { validateRegister, validateLogin } = require("../middleware/validate.middleware");
const { register, login, logout } = require("../controllers/auth.controller");

// POST /api/auth/register
router.post("/register", validateRegister, register);

// POST /api/auth/login
router.post("/login", validateLogin, login);

// POST /api/auth/logout
router.post("/logout", logout);

module.exports = router;
