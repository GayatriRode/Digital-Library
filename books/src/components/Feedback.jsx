import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.jpeg';
import axios from 'axios';
import Swal from 'sweetalert2';

const Feedback = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const { name, email, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedbacks', formData);
      Swal.fire({
        icon: 'success',
        title: 'Feedback submitted successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/customer-dashboard');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      let errorMessage = 'Failed to submit feedback. Please try again.';
      if (err.response && err.response.status === 404) {
        errorMessage = 'Server not found or endpoint not configured.';
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
        <div className="flex items-center">
          <img className="h-10" src={logo} alt="logo" />
          <h4 className="ml-4 text-lg px-2">Digital Library</h4>
        </div>
        <div className="flex items-center space-x-4">
          <Link className="text-sm hover:text-gray-400" to="/customer-dashboard">Home</Link>
          <Link className="text-sm hover:text-gray-400" to="/wishlist">Wishlist</Link>
          <Link className="text-sm hover:text-gray-400" to="/my-order">My Orders</Link>
          <Link className="text-sm hover:text-gray-400" to="/feedback">Give Feedback</Link>
          <button onClick={() => navigate('/')} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input type="text" id="name" name="name" value={name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea id="message" name="message" value={message} onChange={handleChange} rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
