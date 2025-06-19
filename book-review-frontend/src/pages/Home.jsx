import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Failed to fetch books:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-8">Loading books...</p>;
  if (!books.length) return <p className="text-center mt-8">No books found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">📚 Book List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book) => (
          <div key={book._id} className="border rounded-lg shadow-md p-4 bg-white">
            <Link to={`/books/${book._id}`}>
              <h2 className="text-xl font-semibold text-blue-700 hover:underline">
                {book.title}
              </h2>
            </Link>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-sm mt-2 text-yellow-700">
              ⭐ {book.averageRating?.toFixed(1) || 0} ({book.totalReviews || 0} reviews)
            </p>
            <p className="mt-2 text-gray-700 line-clamp-3">
              {book.description?.substring(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
