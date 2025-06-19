import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Review from "../models/Review.js";

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route POST /api/users/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
};

// @route POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  res.json({ _id: user._id, name: user.name, email: user.email, token });
};

// @route GET /api/users/me
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const postedBooks = await Book.find({ createdBy: user._id }).select("title _id");

    const reviewedBooks = await Review.find({ user: user._id })
      .populate("book", "title _id")
      .select("comment rating book");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      postedBooks,
      reviewedBooks,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
