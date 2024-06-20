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
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  const [searchTerm, setSearchTerm] = useState('');
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

    const fetchWishlist = () => {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    };

    fetchBooks();
    fetchWishlist();
  }, []);

  // Load Font Awesome dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const handleAddToWishlist = (book) => {
    const updatedWishlist = [...wishlist, book];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    Swal.fire({
      icon: 'success',
      title: 'Added to Wishlist',
      text: `${book.name} has been added to your wishlist.`,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  };

  const handleRemoveFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter(book => book._id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    Swal.fire({
      icon: 'info',
      title: 'Removed from Wishlist',
      text: `The book has been removed from your wishlist.`,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  };

  const handleBuyBook = async (book) => {
    try {
      const response = await axios.post(`http://localhost:8000/books/purchase/${book._id}`);
      const updatedBook = response.data.book; // Ensure backend sends the updated book data

      // Update the books state with the updated book data
      const updatedBooks = books.map((b) => (b._id === updatedBook._id ? updatedBook : b));
      setBooks(updatedBooks);

      // Update the selectedBook state if it's currently open in modal
      if (selectedBook && selectedBook._id === updatedBook._id) {
        setSelectedBook(updatedBook);
      }

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Purchase Successful',
        text: 'You have successfully purchased the book.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.error('Error buying book - Server responded:', error.response.data);
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: error.response.data.message || 'Failed to buy book.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      } else if (error.request) {
        console.error('Error buying book - No response received:', error.request);
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: 'No response received from server.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      } else {
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

  // Logic to filter and paginate books
  const filteredBooks = books.flatMap(publisher =>
    publisher.authors.flatMap(author =>
      author.books
        .filter(book =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(book => ({ ...book, authorName: author.name, publisherName: publisher.name }))
    )
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

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
          <Link className="text-sm hover:text-gray-400" to="/customer-dashboard">Home</Link>
          <Link className="text-sm hover:text-gray-400" to="/wishlist">Wishlist ({wishlist.length})</Link>
          <button onClick={() => navigate('/')} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by book name, author name or publication house"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        {currentBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentBooks.map((book) => {
              const isBookInWishlist = wishlist.some((item) => item._id === book._id);
              return (
                <div key={book._id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
                  <img src={book.imageUrl} alt={book.name} className="w-full h-60 object-cover object-center" />
                  <div className="absolute top-2 right-2">
                    <i
                      className={`fa${isBookInWishlist ? 's' : 'r'} fa-heart text-2xl cursor-pointer ${isBookInWishlist ? 'text-red-500' : 'text-gray-300'}`}
                      onClick={() => isBookInWishlist ? handleRemoveFromWishlist(book._id) : handleAddToWishlist(book)}
                    ></i>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{book.name}</h2>
                    <p className="text-sm text-gray-600">{book.authorName}</p>
                    <p className="text-sm text-gray-600">{book.publisherName}</p>
                    <p className="mt-2 font-bold text-gray-800">Rs. {book.price}</p>
                    <p className="mt-2 text-gray-700">Available Copies: {book.availableCopies}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <button onClick={() => openModal({ ...book, author: book.authorName, publication: book.publisherName })} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">View More</button>
                      <button onClick={() => handleBuyBook(book)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Buy</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">Search not found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(Math.ceil(filteredBooks.length / booksPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)} className={`mx-1 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 ${currentPage === number + 1 ? 'bg-indigo-600' : ''}`}>
            {number + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedBook && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-md max-w-md w-full">
            <div className="p-4">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                <i className="fas fa-times"></i>
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">{selectedBook.name}</h2>
              <p className="text-sm text-gray-600">By: {selectedBook.author}</p>
              <p className="text-sm text-gray-600">Publisher: {selectedBook.publication}</p>
              <img src={selectedBook.imageUrl} alt={selectedBook.name} className="mt-4 w-full h-60 object-cover object-center" />
              <p className="mt-4 text-gray-700">{selectedBook.description}</p>
              <p className="mt-2 font-bold text-gray-800">Rs. {selectedBook.price}</p>
              <p className="mt-2 text-gray-700">Available Copies: {selectedBook.availableCopies}</p>
              <div className="mt-4 flex justify-center">
                <button onClick={() => handleBuyBook(selectedBook)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Buy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
