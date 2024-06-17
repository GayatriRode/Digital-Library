import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.jpeg';
import Swal from 'sweetalert2';

const CustomerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/books');
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Error fetching books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const handleAddToWishlist = async (book) => {
    try {
      // Simulate adding to wishlist by just updating state
      setWishlist((prevWishlist) => [...prevWishlist, book]);
      Swal.fire({
        icon: 'success',
        title: 'Added to Wishlist',
        text: `${book.name} has been added to your wishlist.`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleBuyBook = async (book) => {
    try {
      const response = await axios.post(`http://localhost:8000/books/purchase/${book._id}`);
      const updatedBooks = books.map((b) => {
        if (b._id === book._id) {
          return { ...b, availableCopies: b.availableCopies - 1 };
        }
        return b;
      });
      setBooks(updatedBooks);
      Swal.fire({
        icon: 'success',
        title: 'Purchase Successful',
        text: `You have successfully purchased ${book.name}.`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      if (error.response) {
        // Request made and server responded with an error status code
        console.error('Error buying book - Server responded:', error.response.data);
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: error.response.data.message || 'Failed to buy book.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error buying book - No response received:', error.request);
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: 'No response received from server.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error buying book - Request setup error:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: error.message || 'Failed to buy book.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading books...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
        <div className="flex items-center">
          <img className="h-10" src={logo} alt="logo" />
          <h4 className="ml-4 text-lg px-2">Digital Library</h4>
        </div>
        <div className="flex items-center space-x-4">
          <Link className="text-sm hover:text-gray-400" to="/">Home</Link>
          <Link className="text-sm hover:text-gray-400" to="/wishlist">Wishlist ({wishlist.length})</Link>
          <button onClick={() => navigate('/')} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((publisher) =>
            publisher.authors.map((author) =>
              author.books.map((book) => (
                <div key={book._id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
                  <img src={book.imageUrl} alt={book.name} className="w-full h-40 object-cover object-center" />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{book.name}</h2>
                    <p className="text-sm text-gray-600">{author.name}</p>
                    <p className="text-sm text-gray-600">{publisher.name}</p>
                    <p className="mt-2 font-bold text-gray-800">Rs. {book.price}</p>
                    <p className="mt-2 text-gray-700">Available Copies: {book.availableCopies}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <button onClick={() => openModal(book)} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">View More</button>
                      <button onClick={() => handleAddToWishlist(book)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        {wishlist.some((item) => item._id === book._id) ? 'Added to Wishlist' : 'Add to Wishlist'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md w-full">
            <button onClick={closeModal} className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <img src={selectedBook.imageUrl} alt={selectedBook.name} className="w-full h-64 object-cover object-center mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{selectedBook.name}</h2>
            <p className="text-sm text-gray-600">Author: {selectedBook.author}</p>
            <p className="text-sm text-gray-600">Publication: {selectedBook.publication}</p>
            <p className="mt-2 font-bold text-gray-800">Rs. {selectedBook.price}</p>
            <p className="mt-2 text-gray-700">{selectedBook.description}</p>
            <p className="mt-2 text-gray-700">Available Copies: {selectedBook.availableCopies}</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => handleAddToWishlist(selectedBook)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                {wishlist.some((item) => item._id === selectedBook._id) ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
              <button onClick={() => handleBuyBook(selectedBook)} className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Buy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
