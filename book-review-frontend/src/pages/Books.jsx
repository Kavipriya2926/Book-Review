import { useEffect, useState } from "react";
import api from "../api/api";
import BookCard from "../components/BookCard";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books").then(res => setBooks(res.data));
  }, []);

  return (
    <div className="p-4 grid gap-4 md:grid-cols-3">
      {books.map(book => <BookCard key={book._id} book={book} />)}
    </div>
  );
}
