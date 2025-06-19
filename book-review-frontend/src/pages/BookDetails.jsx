import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import ReviewForm from "../components/ReviewForm";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}`).then(res => setBook(res.data));
  }, [id]);

  if (!book) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p className="text-gray-700">{book.description}</p>

      <h2 className="mt-6 font-semibold text-xl">Leave a Review</h2>
      <ReviewForm onSubmit={(data) => api.post("/reviews", { ...data, bookId: id })} />
    </div>
  );
}
