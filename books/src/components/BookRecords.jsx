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
    const [booksPerPage, setBooksPerPage] = useState(8);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/books');
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
            fetchBooks(); // Refetch books after deletion
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const updateBook = async () => {
        try {
            await axios.put(`http://localhost:8000/books/${selectedBook._id}`, selectedBook);
            closeModal(); // Close modal after successful update
            fetchBooks(); // Refetch books after update
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const renderBooks = () => {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const booksToRender = books.slice(startIndex, endIndex);

        if (booksToRender.length === 0) {
            return (
                <tr>
                    <td colSpan="10" className="text-center py-4">No books found</td>
                </tr>
            );
        }

        let renderedBooks = [];

        booksToRender.forEach((publisher) => {
            let publisherRowSpan = publisher.authors.reduce((acc, author) => acc + author.books.length, 0);

            publisher.authors.forEach((author, authorIndex) => {
                author.books.forEach((book, bookIndex) => {
                    renderedBooks.push(
                        <tr key={book._id}>
                            {(authorIndex === 0 && bookIndex === 0) && (
                                <td rowSpan={publisherRowSpan} className="border px-4 py-2">{publisher.name}</td>
                            )}
                            {(bookIndex === 0) && (
                                <td rowSpan={author.books.length} className="border px-4 py-2">{author.name}</td>
                            )}
                            <td className="border px-4 py-2">{book.name}</td>
                            <td className="border px-4 py-2"><img src={book.imageUrl} alt={book.name} className="h-16 w-16 object-cover" /></td>
                            <td className="border px-4 py-2">{book.year}</td>
                            <td className="border px-4 py-2">{book.price}</td>
                            <td className="border px-4 py-2">{book.copies}</td>
                            <td className="border px-4 py-2">{book.availableCopies}</td>
                            <td className="border px-4 py-2">{book.copies - book.availableCopies}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => openModal(book)} className="bg-green-500 text-white px-4 mx-2 py-2 rounded">Edit</button>
                                <button onClick={() => deleteBook(book._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                            </td>
                        </tr>
                    );
                });
            });
        });

        return renderedBooks;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedBook({ ...selectedBook, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateBook();
    };

    const totalPages = Math.ceil(books.length / booksPerPage);

    const renderPagination = () => (
        <div className="flex justify-center mt-4">
            <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg-indigo-500 text-white'}`}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-700' : 'bg-indigo-500 text-white'}`}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
                <div className="flex items-center">
                    <img className="h-10" src={logo} alt="logo" />
                    <h4 className="ml-4 text-lg">Digital Library</h4>
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

            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4">Book Records</h2>
                {error && <div className="text-red-500">{error}</div>}
                <table className="min-w-full bg-white border-collapse border border-gray-200 book-records-table">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Publisher</th>
                            <th className="border px-4 py-2">Author</th>
                            <th className="border px-4 py-2">Book Name</th>
                            <th className="border px-4 py-2">Image</th>
                            <th className="border px-4 py-2">Year</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Total Copies</th>
                            <th className="border px-4 py-2">Available Copies</th>
                            <th className="border px-4 py-2">Purchase Count</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderBooks()}
                    </tbody>
                </table>
                {renderPagination()}
            </div>

            {showModal && selectedBook && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Edit Book</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Name</label>
                                <input type="text" name="name" value={selectedBook.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Published Year</label>
                                <input type="number" name="year" value={selectedBook.year} onChange={handleInputChange} className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Total Copies</label>
                                <input type="number" name="copies" value={selectedBook.copies} onChange={handleInputChange} className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Available Copies</label>
                                <input type="number" name="availableCopies" value={selectedBook.availableCopies} onChange={handleInputChange} className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea name="description" value={selectedBook.description} onChange={handleInputChange} className="w-full px-4 py-2 border rounded"></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Price</label>
                                <input type="number" name="price" value={selectedBook.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded ml-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookRecords;
