import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.jpeg';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch wishlist from local storage when component mounts
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
    setLoading(false);
  }, []);

  const getUserId = () => {
    // Replace 'user_id_here' with actual logic to fetch user ID from localStorage or context
    const userId = localStorage.getItem('userId');
    return userId;
  };

  const handleBuyBook = async (bookId) => {
    try {
      const userId = getUserId(); // Fetch user ID dynamically
      const response = await axios.post(`http://localhost:8000/purchase`, { userId, bookId, copies: 1 });
      if (response.status === 200) {
        const updatedBook = response.data.book; // Assuming backend sends the updated book data

        // Remove the purchased book from the wishlist
        const updatedWishlist = wishlist.filter((book) => book._id !== updatedBook._id);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

        Swal.fire({
          icon: 'success',
          title: 'Purchase Successful',
          text: `You have successfully purchased ${updatedBook.name}.`,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Purchase Failed',
        text: 'There was an issue purchasing the book. Please try again later.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleRemoveFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter((book) => book._id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    Swal.fire({
      icon: 'success',
      title: 'Removed from Wishlist',
      text: 'Book has been removed from your wishlist.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading wishlist...</p>;
  }

  return (
    <div className='container'>
      <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-indigo-500 text-gray-100 shadow-md w-full">
        <div className="flex items-center">
          <img className="h-10" src={logo} alt="logo" />
          <h4 className="ml-4 text-lg px-2">Digital Library</h4>
        </div>
        <div className="flex items-center space-x-4">
          <Link className="text-sm hover:text-gray-400" to="/customer-dashboard">Home</Link>
          <Link className="text-sm hover:text-gray-400" to="/wishlist">Wishlist ({wishlist.length})</Link>
          <Link className="text-sm hover:text-gray-400" to="/my-order">My Orders</Link>
          <button onClick={() => navigate('/')} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wishlist.map((book) => (
              <div key={book._id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
                {/* Replace with your book image rendering */}
                <img src={book.imageUrl} alt={book.name} className="w-full h-40 object-cover object-center" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{book.name}</h2>
                  <p className="text-sm text-gray-600">Available: {book.availableCopies}</p>
                  <p className="mt-2 font-bold text-gray-800">Rs. {book.price}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => handleBuyBook(book._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(book._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
