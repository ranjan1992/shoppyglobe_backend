const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { sxpiration: "7d" });
};

// @route   POST /register
// @desc    Register a new user
// @access  Public

router.post("/register", async (req, res) => {
  try {
    // Validate the required fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email and password" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email or username already exists!" });
    }

    // Create User Password (password hashed in model pre-save hook)
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
