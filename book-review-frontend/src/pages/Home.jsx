import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get("/books").then((res) => setBooks(res.data));
  }, []);

  return (
    <div>
      <h1>Book List</h1>
      {books.map(book => (
        <div key={book._id}>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
      ))}
    </div>
  );
}
