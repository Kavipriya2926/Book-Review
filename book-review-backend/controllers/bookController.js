import Book from "../models/Book.js";

// @route GET /api/books
export const getBooks = async (req, res) => {
  const books = await Book.find({});
  res.json(books);
};

// @route GET /api/books/:id
export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

// @route POST /api/books (admin only)
export const addBook = async (req, res) => {
  const { title, author, description, genre } = req.body;
  const book = await Book.create({ title, author, description, genre });
  res.status(201).json(book);
};
