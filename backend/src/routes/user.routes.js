const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getProfile, updateProfile, changePassword } = require("../controllers/user.controller");

// All user routes require a valid token
router.use(authMiddleware);

router.get("/me",          getProfile);
router.put("/me",          updateProfile);
router.put("/me/password", changePassword);

module.exports = router;
