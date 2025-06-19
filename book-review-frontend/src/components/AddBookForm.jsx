import { useState } from "react";
import API from "../api/axios";

export default function AddBookForm() {
  const [book, setBook] = useState({ title: "", author: "", description: "", genre: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/books", book);
    alert("Book added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={book.title} onChange={e => setBook({ ...book, title: e.target.value })} placeholder="Title" />
      <input value={book.author} onChange={e => setBook({ ...book, author: e.target.value })} placeholder="Author" />
      <textarea value={book.description} onChange={e => setBook({ ...book, description: e.target.value })} placeholder="Description" />
      <input value={book.genre} onChange={e => setBook({ ...book, genre: e.target.value })} placeholder="Genre" />
      <button type="submit">Add Book</button>
    </form>
  );
}
