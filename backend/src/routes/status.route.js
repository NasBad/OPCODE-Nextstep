const express = require("express");
const router  = express.Router();

// GET /api/status — health check
router.get("/", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

module.exports = router;
