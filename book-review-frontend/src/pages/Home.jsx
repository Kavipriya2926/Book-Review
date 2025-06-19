import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const booksPerPage = 6;

  // Load all books once
  useEffect(() => {
    API.get("/books")
      .then((res) => {
        setBooks(res.data);
        setFiltered(res.data); // default filtered = all
      })
      .catch((err) => console.error("Failed to fetch books:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handle all filtering, sorting and searching
  useEffect(() => {
    let result = [...books];
    
    // Filter by genre
    if (genre !== "all") {
      result = result.filter(book => book.genre === genre);
    }
    
    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
      );
    }
    
    // Sort the results
    switch(sortBy) {
      case "rating":
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "reviews":
        result.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
        break;
      case "recent":
      default:
        // Assuming books have a createdAt or publishDate field
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    
    setFiltered(result);
    setPage(1); // reset to first page whenever filters change
  }, [books, search, genre, sortBy]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is handled by the useEffect above
  };

  // Extract unique genres for filter dropdown
  const genres = ["all", ...new Set(books.map(book => book.genre).filter(Boolean))];

  // Pagination logic
  const startIdx = (page - 1) * booksPerPage;
  const endIdx = startIdx + booksPerPage;
  const paginatedBooks = filtered.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filtered.length / booksPerPage);

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-md bg-white">
              <div className="h-48 bg-gray-300 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!books.length) return (
    <div className="max-w-6xl mx-auto mt-16 text-center px-4">
      <h2 className="text-2xl font-semibold text-gray-700">No books in the library yet</h2>
      <p className="mt-2 text-gray-500">Be the first to add a book to our collection!</p>
      <Link to="/add-book" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Add a Book
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-12">
      {/* Hero Section with nice gradient */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-6 py-12 md:py-16 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Next Favorite Book</h1>
          <p className="text-lg max-w-2xl mx-auto">Explore our curated collection of books across various genres and find your perfect read</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by title or author"
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                id="genre"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {genres.map(g => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                id="sort"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title (A-Z)</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <button 
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>Showing {filtered.length} {filtered.length === 1 ? 'book' : 'books'}</div>
        <div>Page {page} of {totalPages || 1}</div>
      </div>

      {/* Book Display */}
      {filtered.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-lg text-yellow-800 mb-2">No books match your search</p>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBooks.map((book) => (
            <motion.div 
              key={book._id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="h-48 bg-gradient-to-r from-blue-200 to-indigo-100 flex items-center justify-center">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">📖</div>
                )}
              </div>
              <div className="p-5">
                <Link to={`/books/${book._id}`}>
                  <h2 className="text-xl font-bold text-gray-800 hover:text-blue-700 transition-colors line-clamp-2">
                    {book.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mt-1">by {book.author}</p>
                <div className="flex items-center mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${i < Math.floor(book.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    {book.averageRating?.toFixed(1) || "0.0"} ({book.totalReviews || 0})
                  </span>
                </div>
                {book.genre && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mt-3">
                    {book.genre}
                  </span>
                )}
                <p className="mt-3 text-gray-600 line-clamp-2">
                  {book.description || "No description available"}
                </p>
                <Link 
                  to={`/books/${book._id}`}
                  className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  View details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedBooks.map((book) => (
            <motion.div 
              key={book._id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 sm:w-40 h-auto bg-gradient-to-r from-blue-200 to-indigo-100 flex items-center justify-center flex-shrink-0">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-4xl">📖</div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/books/${book._id}`}>
                      <h2 className="text-xl font-bold text-gray-800 hover:text-blue-700 transition-colors">
                        {book.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600">by {book.author}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 font-bold mr-1">{book.averageRating?.toFixed(1) || "0.0"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-600 text-sm ml-1">
                      ({book.totalReviews || 0})
                    </span>
                  </div>
                </div>
                {book.genre && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mt-2">
                    {book.genre}
                  </span>
                )}
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {book.description || "No description available"}
                </p>
                <Link 
                  to={`/books/${book._id}`}
                  className="mt-3 inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  View details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setPage(prevPage => Math.max(1, prevPage - 1))}
              disabled={page === 1}
              className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              
              // Calculate which page numbers to show
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              // Only render if pageNum is valid
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                      page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => setPage(prevPage => Math.min(totalPages, prevPage + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}