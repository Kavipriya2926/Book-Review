import Review from "../models/Review.js";
import Book from "../models/Book.js";

// @route GET /api/reviews?bookId=...
export const getReviews = async (req, res) => {
  const { bookId } = req.query;
  const reviews = await Review.find({ book: bookId }).populate("user", "name");
  res.json(reviews);
};

// @route POST /api/reviews
export const addReview = async (req, res) => {
  const { bookId, comment, rating } = req.body;

  const review = await Review.create({
    book: bookId,
    user: req.user.id,
    comment,
    rating,
  });

  // Update book stats (optional)
  const book = await Book.findById(bookId);
  const allReviews = await Review.find({ book: bookId });
  book.totalReviews = allReviews.length;
  book.averageRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / book.totalReviews;
  await book.save();

  res.status(201).json(review);
};
