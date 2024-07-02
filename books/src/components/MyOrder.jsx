import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../images/logo.jpeg';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch customerId from localStorage
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
          setError('Customer ID not found');
          setLoading(false);
          return;
        }

        // Validate customerId against the backend
        const response = await axios.get(`http://localhost:8000/api/orders/${customerId}`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-50 flex justify-between items-center w-full py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
        <div className="flex items-center">
          <img className="h-10" src={logo} alt="logo" />
          <h4 className="ml-4 text-lg">Digital Library</h4>
        </div>
        <div className="flex items-center space-x-4">
          <Link className="text-sm hover:text-gray-400" to="/">Home</Link>
          <Link className="text-sm hover:text-gray-400" to="/customer-records">Customer Records</Link>
          <Link className="text-sm hover:text-gray-400" to="/add-book">Add Book</Link>
          <Link className="text-sm hover:text-gray-400" to="/book-records">Book Records</Link>
          <button onClick={() => navigate('/')} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">{order.book.title}</h3>
                <p className="text-gray-600 mb-2">{order.book.author}</p>
                <p className="text-gray-600 mb-2">{new Date(order.orderDate).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-2">Price: ${order.price}</p>
                <p className="text-gray-600 mb-2">Copies Purchased: {order.copiesPurchased}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
