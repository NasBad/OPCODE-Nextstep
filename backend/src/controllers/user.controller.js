const bcrypt = require("bcrypt");

// Shared users array — imported from auth controller
// In production this would be the database, for now we share the same in-memory array
let users = [];
try { users = require("./auth.controller").users; } catch { users = []; }

exports.getProfile = (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email });
};

exports.updateProfile = (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.name)  user.name  = req.body.name;
  if (req.body.email) user.email = req.body.email;

  res.json({ id: user.id, name: user.name, email: user.email });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return res.status(400).json({ message: "Current password is incorrect" });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  res.json({ message: "Password updated successfully" });
};
