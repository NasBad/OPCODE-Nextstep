const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // Save user to database
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // Create token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
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