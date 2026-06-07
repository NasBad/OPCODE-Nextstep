const express    = require("express");
const router     = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getJobs, addJob, updateJob, updateJobStatus,
  deleteJob, restoreJob, getNotes, saveNotes,
} = require("../controllers/job.controller");

// All job routes require a valid token
router.use(authMiddleware);

router.get("/",                getJobs);
router.post("/",               addJob);
router.put("/:id",             updateJob);
router.patch("/:id/status",    updateJobStatus);
router.delete("/:id",          deleteJob);
router.patch("/:id/restore",   restoreJob);
router.get("/:id/notes",       getNotes);
router.patch("/:id/notes",     saveNotes);

module.exports = router;
