const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// In-memory users array (resets when server restarts)
const users = [];

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // Save user to mock array
  const user = { id: uuidv4(), name, email, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);

  // Create token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user in mock array
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Check password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Create token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};

exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};
