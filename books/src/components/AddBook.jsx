import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.jpeg';

const AddBook = () => {
  const [name, setName] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [price, setPrice] = useState('');
  const [publicationHouseName, setPublicationHouseName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setPublicationHouseName('');
    setAuthorName('');
    setName('');
    setPublishedYear('');
    setDescription('');
    setPhoto('');
    setTotalCopies('');
    setPrice('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBook = {
      publicationHouseName,
      authorName,
      name,
      publishedYear,
      description,
      photo,
      totalCopies: parseInt(totalCopies),
      price: parseFloat(price),
    };

    try {
      const response = await axios.post('http://localhost:8000/add-book', newBook);
      console.log('Server response:', response.data);
      alert('Book added successfully');
      resetForm();
    } catch (error) {
      console.error('Error adding book:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
        setError(error.response.data.message || 'Failed to add book');
      } else {
        setError('Failed to add book');
      }
      alert('Failed to add book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-50 flex py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
                <div className="flex items-center">
                    <img className="h-10" src={logo} alt="logo" />
                    <h4 className="ml-4 text-lg px-4">Digital Library</h4>
                </div>
                <div className="flex items-center space-x-4">
                    <Link className="text-sm hover:text-gray-400" to="/admin-dashboard">Home</Link>
                    <Link className="text-sm hover:text-gray-400" to="/customer-records">Customer Records</Link>
                    <Link className="text-sm hover:text-gray-400" to="/add-book">Add Book</Link>
                    <Link className="text-sm hover:text-gray-400" to="/book-records">Book Records</Link>
                    <Link className="text-sm hover:text-gray-400" to="/order-records">Order Records</Link>
                    <button onClick={() => window.location.href = '/'} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
            </nav>

      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Add a Book</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publicationHouseName">
              Publication House Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="publicationHouseName"
              type="text"
              placeholder="Publication House Name"
              value={publicationHouseName}
              onChange={(e) => setPublicationHouseName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authorName">
              Author Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="authorName"
              type="text"
              placeholder="Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Book Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publishedYear">
              Published Year
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="publishedYear"
              type="number"
              placeholder="Published Year"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Book Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
              Photo URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="photo"
              type="text"
              placeholder="Photo URL"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalCopies">
              Total Copies
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="totalCopies"
              type="number"
              placeholder="Total Copies"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
