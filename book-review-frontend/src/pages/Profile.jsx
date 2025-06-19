import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users/me")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Failed to load profile", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;

  if (!profile) return <p className="text-center mt-6">No profile found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>

      <hr className="my-6" />

      {/* Posted Books */}
      <h2 className="text-xl font-semibold mb-2">📘 Books Posted</h2>
      {profile.postedBooks?.length ? (
        <ul className="list-disc ml-5">
          {profile.postedBooks.map((book) => (
            <li key={book._id}>
              <Link to={`/books/${book._id}`} className="text-blue-600 hover:underline">
                {book.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No books posted yet.</p>
      )}

      <hr className="my-6" />

      {/* Reviewed Books */}
      <h2 className="text-xl font-semibold mb-2">📝 Books Reviewed</h2>
      {profile.reviewedBooks?.length ? (
        <ul className="list-disc ml-5">
          {profile.reviewedBooks.map((review) => (
            <li key={review._id}>
              <Link to={`/books/${review.book._id}`} className="text-blue-600 hover:underline">
                {review.book.title}
              </Link>{" "}
              – "{review.comment}" ({review.rating}★)
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No reviews written yet.</p>
      )}
    </div>
  );
}
