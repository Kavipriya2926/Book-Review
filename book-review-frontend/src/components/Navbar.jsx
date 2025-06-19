import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">BookReview</Link>

      <div className="space-x-4 flex items-center">
        <Link to="/books">Books</Link>

        {user ? (
          <>
            <Link to="/profile" className="text-sm font-medium">
              {user.name.split(" ")[0]}
            </Link>
            <button onClick={logout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
