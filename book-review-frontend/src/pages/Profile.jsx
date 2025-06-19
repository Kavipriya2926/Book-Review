import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me");
        setProfile(res.data);
        setError(null);
        // Update page title with user's name
        document.title = `${res.data.name}'s Profile | BookReview`;
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Unable to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      document.title = "BookReview"; // Reset title on unmount
    };
  }, []);

  // Format date to display in a user-friendly format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200"></div>
              <div className="ml-4">
                <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Tabs skeleton */}
          <div className="mt-8 border-b border-gray-200">
            <div className="flex space-x-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="mt-6 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-36 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-red-50 p-8 rounded-lg border border-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Profile Unavailable</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700">No profile found</h2>
        <p className="mt-2 text-gray-600">Unable to retrieve your profile information.</p>
        <Link 
          to="/" 
          className="mt-6 inline-block px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Profile Header */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative">
            <div className="flex items-end">
              {/* Profile Avatar */}
              <div className="-mt-12 sm:-mt-16 border-4 border-white rounded-full overflow-hidden h-24 w-24 sm:h-32 sm:w-32 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={`${profile.name}'s profile`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerText = getInitials(profile.name);
                    }}
                  />
                ) : (
                  getInitials(profile.name)
                )}
              </div>
              
              {/* Profile Name & Info */}
              <div className="ml-4 sm:ml-6 pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-gray-600">
                  {profile.bio || "Book enthusiast and reviewer"}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button 
                onClick={() => navigate('/settings')} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <span className="block text-2xl font-bold text-blue-700">{profile.postedBooks?.length || 0}</span>
              <span className="text-blue-600 text-sm">Books Posted</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <span className="block text-2xl font-bold text-indigo-700">{profile.reviewedBooks?.length || 0}</span>
              <span className="text-indigo-600 text-sm">Reviews Written</span>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center col-span-2 sm:col-span-1">
              <span className="block text-2xl font-bold text-purple-700">{profile.joinDate ? formatDate(profile.joinedAt || profile.createdAt) : "N/A"}</span>
              <span className="text-purple-600 text-sm">Member Since</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === "books"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
            >
              Books
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Profile Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.name}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.email}</dd>
                    </div>
                    {profile.location && (
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.location}</dd>
                      </div>
                    )}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Member since</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formatDate(profile.joinedAt || profile.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Activity Summary */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden divide-y divide-gray-200">
                  {/* Recently Posted Book (if available) */}
                  {profile.postedBooks?.length > 0 && (
                    <Link to={`/books/${profile.postedBooks[0]._id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              Posted a book: {profile.postedBooks[0].title}
                            </p>
                            <p className="text-sm text-gray-500">
                              by {profile.postedBooks[0].author}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                  
                  {/* Recently Reviewed Book (if available) */}
                  {profile.reviewedBooks?.length > 0 && profile.reviewedBooks[0].book && (
                    <Link to={`/books/${profile.reviewedBooks[0].book._id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              Reviewed: {profile.reviewedBooks[0].book.title}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-4 w-4 ${i < profile.reviewedBooks[0].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1">
                                ({profile.reviewedBooks[0].rating}/5)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                  
                  {profile.postedBooks?.length === 0 && profile.reviewedBooks?.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <p className="text-gray-500">No recent activity to display</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "books" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Books Posted</h2>
                <Link 
                  to="/add-book" 
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Book
                </Link>
              </div>
              
              {profile.postedBooks?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.postedBooks.map((book) => (
                    <Link 
                      to={`/books/${book._id}`}
                      key={book._id} 
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col"
                    >
                      <div className="aspect-[2/3] bg-gray-100 relative">
                        {book.coverImage ? (
                          <img 
                            src={book.coverImage} 
                            alt={`Cover of ${book.title}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                            📖
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                        {book.averageRating !== undefined && (
                          <div className="flex items-center mt-auto">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className={`h-4 w-4 ${i < Math.floor(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">
                              ({book.averageRating?.toFixed(1) || "0.0"}) • {book.totalReviews || 0} {book.totalReviews === 1 ? 'review' : 'reviews'}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Posted Yet</h3>
                  <p className="text-gray-600 mb-6">Share your favorite books with the community</p>
                  <Link 
                    to="/add-book" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Your First Book
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Reviews Written</h2>
              
              {profile.reviewedBooks?.length ? (
                <div className="space-y-4">
                  {profile.reviewedBooks.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      {review.book ? (
                        <Link to={`/books/${review.book._id}`} className="block hover:bg-gray-50">
                          <div className="p-4 sm:p-6">
                            <div className="flex items-start">
                              <div className="hidden sm:block flex-shrink-0 mr-4">
                                {review.book.coverImage ? (
                                  <img 
                                    src={review.book.coverImage} 
                                    alt={`Cover of ${review.book.title}`}
                                    className="w-16 h-20 object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-20 bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
                                    📖
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <svg 
                                        key={i} 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  {review.createdAt && (
                                    <span className="ml-2 text-sm text-gray-500">
                                      {formatDate(review.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <h3 className="mt-2 text-lg font-medium text-blue-600">{review.book.title}</h3>
                                <p className="text-sm text-gray-600">by {review.book.author}</p>
                                <div className="mt-3 text-gray-700">
                                  {review.comment ? (
                                    <p>"{review.comment}"</p>
                                  ) : (
                                    <p className="text-gray-500 italic">No comment provided</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <div className="mt-2 italic text-gray-500">
                            Book no longer available
                          </div>
                          {review.comment && (
                            <div className="mt-2">
                              <p>"{review.comment}"</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Written Yet</h3>
                  <p className="text-gray-600 mb-6">Share your thoughts about books you've read</p>
                  <Link 
                    to="/books" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Browse Books to Review
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}