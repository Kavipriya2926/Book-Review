import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="font-bold text-xl">{book.title}</h2>
      <p className="text-gray-600">{book.author}</p>
      <p className="text-sm mt-2">{book.description?.slice(0, 100)}...</p>
      <Link to={`/books/${book._id}`} className="text-blue-600 mt-2 inline-block">Read More</Link>
    </div>
  );
}
