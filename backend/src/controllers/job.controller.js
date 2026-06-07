const { v4: uuidv4 } = require("uuid");

// In-memory jobs array (resets when server restarts)
const jobs = [];

exports.getJobs = (req, res) => {
  const userJobs = jobs.filter((j) => j.userId === req.user.userId);
  res.json(userJobs);
};

exports.addJob = (req, res) => {
  const job = {
    id: uuidv4(),
    userId: req.user.userId,
    companyName: req.body.companyName,
    jobTitle: req.body.jobTitle,
    status: req.body.status || "Wishlist",
    location: req.body.location || null,
    workType: req.body.workType || null,
    jobUrl: req.body.jobUrl || null,
    platform: req.body.platform || null,
    notes: req.body.notes || null,
    tags: req.body.tags || [],
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.push(job);
  res.status(201).json(job);
};

exports.updateJob = (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id && j.userId === req.user.userId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  Object.assign(job, req.body, { updatedAt: new Date().toISOString() });
  res.json(job);
};

exports.updateJobStatus = (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id && j.userId === req.user.userId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  job.status = req.body.status;
  job.updatedAt = new Date().toISOString();
  res.json(job);
};

exports.deleteJob = (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id && j.userId === req.user.userId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  job.isDeleted = true;
  job.updatedAt = new Date().toISOString();
  res.json(job);
};

exports.restoreJob = (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id && j.userId === req.user.userId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  job.isDeleted = false;
  job.updatedAt = new Date().toISOString();
  res.json(job);
};

exports.getNotes = (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id && j.userId === req.user.userId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  res.json({ notes: job.notes });
};

exports.saveNotes = (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id && j.userId === req.user.userId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  job.notes = req.body.notes;
  job.updatedAt = new Date().toISOString();
  res.json(job);
};
