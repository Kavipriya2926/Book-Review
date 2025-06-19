import { useState } from "react";
import API from "../api/axios";

export default function ReviewForm({ bookId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", { bookId, comment, rating });
      setRating(5);
      setComment("");
      alert("Review submitted!");
      onReviewAdded(); // refresh reviews list
    } catch (err) {
      alert(err.response?.data?.message || "Review submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
      <textarea
        className="border p-2"
        placeholder="Your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <select className="border p-2 w-24" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((val) => (
          <option key={val} value={val}>{val} Stars</option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-fit">Submit Review</button>
    </form>
  );
}
