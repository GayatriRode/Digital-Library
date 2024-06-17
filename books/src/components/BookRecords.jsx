import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../images/logo.jpeg';

const BookRecords = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10); // Number of books per page

    useEffect(() => {
        fetchBooks();
    }, [currentPage]); // Fetch books whenever currentPage changes

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/books?page=${currentPage}&limit=${booksPerPage}`);
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setError('Failed to fetch books');
        }
    };

    const openModal = (book) => {
        setSelectedBook(book);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedBook(null);
        setShowModal(false);
    };

    const deleteBook = async (bookId) => {
        try {
            await axios.delete(`http://localhost:8000/books/${bookId}`);
            fetchBooks(); // Refresh book list after deletion
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedBook({ ...selectedBook, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:8000/books/${selectedBook._id}`, selectedBook);
            closeModal(); // Close modal after successful update
            fetchBooks(); // Refresh book list after update
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
                <div className="flex items-center">
                    <img className="h-10" src={logo} alt="logo" />
                    <h4 className="ml-4 text-lg">Digital Library</h4>
                </div>
                <div className="flex items-center space-x-4">
                    <Link className="text-sm hover:text-gray-400" to="/">Home</Link>
                    <Link className="text-sm hover:text-gray-400" to="/add-book">Add Book</Link>
                    <Link className="text-sm hover:text-gray-400" to="/book-records">Book Records</Link>
                    <button onClick={() => window.location.href = '/'} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Book Records</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="overflow-x-auto">
                    <table className="max-w-6xl bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-2 px-4 font-semibold uppercase">Publisher</th>
                                <th className="py-2 px-4 font-semibold uppercase">Author</th>
                                <th className="py-2 px-4 font-semibold uppercase">Book Name</th>
                                <th className="py-2 px-4 font-semibold uppercase">Published Year</th>
                                <th className="py-2 px-4 font-semibold uppercase">Total Copies</th>
                                <th className="py-2 px-4 font-semibold uppercase">Purchased Copies</th>
                                <th className="py-2 px-4 font-semibold uppercase">Available Copies</th>
                                <th className="py-2 px-4 font-semibold uppercase">Price</th>
                                <th className="py-2 px-4 font-semibold uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {books.map((publisher) =>
                                publisher.authors.map((author, index) => (
                                    author.books.map((book, bIndex) => (
                                        <tr key={book._id}>
                                            {index === 0 && bIndex === 0 && (
                                                <td className="py-2 px-4" rowSpan={author.books.length}>
                                                    {publisher.name}
                                                </td>
                                            )}
                                            {bIndex === 0 && (
                                                <td className="py-2 px-4" rowSpan={author.books.length}>
                                                    {author.name}
                                                </td>
                                            )}
                                            <td className="py-2 px-4">{book.name}</td>
                                            <td className="py-2 px-4">{book.year}</td>
                                            <td className="py-2 px-4">{book.copies}</td>
                                            <td className="py-2 px-4">{book.purchasedCopies}</td>
                                            <td className="py-2 px-4">{book.availableCopies}</td>
                                            <td className="py-2 px-4">{book.price}</td>
                                            <td className="py-2 px-4">
                                                <div className="flex space-x-2">
                                                    <button onClick={() => openModal(book)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                                                    <button onClick={() => deleteBook(book._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`bg-gray-200 text-gray-600 px-3 py-1 rounded ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-300'}`}
                >
                    Previous
                </button>
                <div>
                    Page {currentPage}
                </div>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={books.length < booksPerPage}
                    className={`bg-gray-200 text-gray-600 px-3 py-1 rounded ${books.length < booksPerPage ? 'cursor-not-allowed' : 'hover:bg-gray-300'}`}
                >
                    Next
                </button>
            </div>

            {/* Modal for Editing Book Details */}
            {selectedBook && (
                <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center ${showModal ? '' : 'hidden'}`}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Edit Book</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Publisher</label>
                                <input
                                    type="text"
                                    value={selectedBook.publisher}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Author</label>
                                <input
                                    type="text"
                                    value={selectedBook.author}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Book Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedBook.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500                                     focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={selectedBook.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={selectedBook.image}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Total Copies</label>
                                <input
                                    type="text"
                                    name="copies"
                                    value={selectedBook.copies}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Purchased Copies</label>
                                <input
                                    type="text"
                                    name="purchasedCopies"
                                    value={selectedBook.purchasedCopies}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Available Copies</label>
                                <input
                                    type="text"
                                    name="availableCopies"
                                    value={selectedBook.availableCopies}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={selectedBook.price}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Changes</button>
                                <button onClick={closeModal} className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Back to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default BookRecords;

