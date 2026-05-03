const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes   = require("./routes/auth.routes");
const jobRoutes    = require("./routes/job.routes");
const userRoutes   = require("./routes/user.routes");
const statusRoute  = require("./routes/status.route");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.use("/api/auth",   authRoutes);
app.use("/api/jobs",   jobRoutes);
app.use("/api/users",  userRoutes);
app.use("/api/status", statusRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: true, message: err.message || "Something went wrong" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
