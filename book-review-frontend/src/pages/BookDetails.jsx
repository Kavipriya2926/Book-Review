import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Fetch book and reviews with proper error handling
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bookRes, reviewRes] = await Promise.all([
        API.get(`/books/${id}`),
        API.get(`/reviews?bookId=${id}`)
      ]);
      
      setBook(bookRes.data);
      setReviews(reviewRes.data);
      
      // Check if current user has already reviewed this book
      if (user) {
        const hasReviewed = reviewRes.data.some(review => review.userId === user.id);
        setUserHasReviewed(hasReviewed);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Failed to load book details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
    // Update page title
    return () => {
      document.title = "Book Library";
    };
  }, [fetchData]);

  // Update page title when book data is loaded
  useEffect(() => {
    if (book) {
      document.title = `${book.title} by ${book.author} | Book Library`;
    }
  }, [book]);

  // Handle successful review submission
  const handleReviewAdded = () => {
    fetchData();
    setShowReviewForm(false);
    setUserHasReviewed(true);
  };

  // Generate JSX for star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex items-center" aria-label={`Rating: ${rating || 0} out of 5`}>
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${i < Math.floor(rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 w-2/3 bg-gray-200 rounded mb-6"></div>
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="h-8 w-40 bg-gray-200 rounded mt-8 mb-4"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-5 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/5 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-11/12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-12 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700">Unable to load book details</h2>
          <p className="mt-2 text-gray-700">{error}</p>
          <button 
            onClick={fetchData} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Book not found
  if (!book) {
    return (
      <div className="max-w-3xl mx-auto mt-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Book not found</h2>
        <p className="text-gray-600 mt-2">The book you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Book List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Navigation */}
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Book List
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover and Main Info */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 aspect-[2/3] rounded-lg flex items-center justify-center mb-4 shadow-md overflow-hidden">
            {book.coverImage ? (
              <img 
                src={book.coverImage} 
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-8xl">📖</div>
            )}
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              {renderStars(book.averageRating)}
              <span className="ml-2 text-lg font-medium text-yellow-700">
                {book.averageRating?.toFixed(1) || "0.0"}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({book.totalReviews || 0} {book.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            {book.genre && (
              <div className="mb-3">
                <h3 className="text-sm text-gray-500">Genre</h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded mt-1">
                  {book.genre}
                </span>
              </div>
            )}
            
            {book.publisher && (
              <div className="mb-3">
                <h3 className="text-sm text-gray-500">Publisher</h3>
                <p className="text-gray-700">{book.publisher}</p>
              </div>
            )}
            
            {book.publishedDate && (
              <div className="mb-3">
                <h3 className="text-sm text-gray-500">Published</h3>
                <p className="text-gray-700">
                  {new Date(book.publishedDate).toLocaleDateString()}
                </p>
              </div>
            )}
            
            {book.isbn && (
              <div>
                <h3 className="text-sm text-gray-500">ISBN</h3>
                <p className="text-gray-700">{book.isbn}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Book Details and Reviews */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
            <p className="text-xl text-gray-600 mt-1">by {book.author}</p>
            
            {/* Description section */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Description</h2>
              <div className="prose max-w-none text-gray-700">
                {book.description || "No description available for this book."}
              </div>
            </div>

            {/* Review CTAs */}
            <div className="mt-8 mb-6 border-t border-b border-gray-200 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Reader Reviews
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {reviews.length === 0 
                      ? "Be the first to review this book!" 
                      : `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'} from our community`
                    }
                  </p>
                </div>
                
                {user && !userHasReviewed && (
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Review form */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4 text-blue-800">Write Your Review</h3>
                    <ReviewForm bookId={id} onReviewAdded={handleReviewAdded} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* User has already reviewed message */}
            {user && userHasReviewed && !showReviewForm && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-700">
                    You've already reviewed this book. Thank you for your feedback!
                  </p>
                </div>
              </div>
            )}
            
            {/* Reviews list */}
            {reviews.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ReviewList reviews={reviews} />
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500">
                  {user 
                    ? "Be the first to share your thoughts on this book!" 
                    : "Sign in to be the first to review this book."
                  }
                </p>
                {!user && (
                  <Link 
                    to="/login" 
                    className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-800"
                  >
                    Log in to write a review →
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Related books section - this would require additional API endpoints */}
      {/* {relatedBooks && relatedBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedBooks.map(book => (
              <BookCard key={book._id} book={book} compact />
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}