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
// @route POST /api/books (admin only or logged-in users)
export const addBook = async (req, res) => {
  try {
    const { title, author, description, genre } = req.body;

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      createdBy: req.user.id, // ✅ Track who created the book
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ message: "Failed to add book" });
  }
};
