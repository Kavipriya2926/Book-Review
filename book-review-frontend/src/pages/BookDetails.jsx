import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useAuth } from "../context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchData = async () => {
    const bookRes = await API.get(`/books/${id}`);
    const reviewRes = await API.get(`/reviews?bookId=${id}`);
    setBook(bookRes.data);
    setReviews(reviewRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!book) return <p>Loading book...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p className="text-gray-600">by {book.author}</p>
      <p className="mt-4">{book.description}</p>
      <p className="mt-2 text-yellow-600">
        Avg. Rating: {book.averageRating?.toFixed(1) || 0} ⭐ ({book.totalReviews} reviews)
      </p>

      <h3 className="mt-8 text-xl font-semibold">Reviews</h3>
      <ReviewList reviews={reviews} />

      {user && (
        <>
          <h3 className="mt-8 text-lg font-medium">Write a Review</h3>
          <ReviewForm bookId={id} onReviewAdded={fetchData} />
        </>
      )}
    </div>
  );
}
