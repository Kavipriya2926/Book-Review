import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddBookForm from "../components/AddBookForm";
import { motion } from "framer-motion";

export default function AddBook() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedBook, setSubmittedBook] = useState(null);
  const navigate = useNavigate();

  const handleFormSuccess = (bookData) => {
    setSubmittedBook(bookData);
    setFormSubmitted(true);
    
    // Automatically navigate to the book details page after 3 seconds
    setTimeout(() => {
      navigate(`/books/${bookData._id}`);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-gray-700">Home</Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li className="font-medium text-gray-700">Add Book</li>
        </ol>
      </nav>

      {formSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Book Added Successfully!</h2>
          <p className="text-green-700 mb-4">
            "{submittedBook?.title}" has been added to the library.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
            <Link 
              to={`/books/${submittedBook?._id}`} 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              View Book Details
            </Link>
            <button 
              onClick={() => {
                setFormSubmitted(false);
                setSubmittedBook(null);
              }} 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Add Another Book
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to book details page in 3 seconds...
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg py-6 px-6 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">Add a New Book</h1>
            <p className="mt-2 text-blue-100">
              Share a book with the community by adding it to our library
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-b-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6 flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Book Information</h2>
                  <p className="text-sm text-gray-500">
                    Please fill in all the required fields marked with an asterisk (*).
                  </p>
                </div>
              </div>

              <AddBookForm onSuccess={handleFormSuccess} />
            </div>
            
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50 rounded-b-lg">
              <div className="text-sm text-gray-500">
                By submitting this form, you confirm that you have the rights to share this book information
                and agree to our <Link to="/terms" className="text-blue-600 hover:underline">terms and conditions</Link>.
              </div>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="mt-8 border border-blue-200 rounded-lg bg-blue-50 p-4">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Tips for Adding Books
            </h3>
            <ul className="text-sm text-blue-700 space-y-1 ml-6 list-disc">
              <li>Make sure to include a descriptive title that matches the official book title</li>
              <li>For author names, use the format "First Last" (e.g., "Jane Austen")</li>
              <li>ISBN numbers can typically be found on the back cover or copyright page</li>
              <li>Adding a cover image URL will help others recognize the book</li>
              <li>A detailed description helps users decide if they want to read the book</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}