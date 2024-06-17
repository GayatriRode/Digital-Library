import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wishlist = ({ userId }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/wishlist/${userId}`);
                setWishlist(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setError('Error fetching wishlist. Please try again later.');
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [userId]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading wishlist...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {wishlist.map(book => (
                    <div key={book._id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
                        <img src={book.imageUrl} alt={book.name} className="w-full h-40 object-cover object-center" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800">{book.name}</h2>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            <p className="text-sm text-gray-600">{book.publisher}</p>
                            <p className="mt-2 font-bold text-gray-800">${book.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
