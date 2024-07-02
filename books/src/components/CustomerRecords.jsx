import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../images/logo.jpeg';
import { useNavigate, Link } from 'react-router-dom';

const CustomerRecords = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customer records from your backend API
    axios.get('http://localhost:8000/api/customers')
      .then(response => {
        setCustomers(response.data); // Assuming response.data is an array of customer objects
      })
      .catch(error => {
        console.error('Error fetching customer records:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

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
          <Link className="text-sm hover:text-gray-400" to="/order-records">Order Records</Link>
          <button onClick={() => navigate('/')} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Customer Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Login Time</th>
                <th className="px-4 py-2">Logout Time</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td className="border px-4 py-2">{customer.name}</td>
                  <td className="border px-4 py-2">{customer.phone}</td>
                  <td className="border px-4 py-2">{customer.email}</td>
                  <td className="border px-4 py-2">{customer.username}</td>
                  <td className="border px-4 py-2">{formatDate(customer.loginDates[0].loginTime)}</td>
                  <td className="border px-4 py-2">{customer.loginDates[0].logoutTime ? formatDate(customer.loginDates[0].logoutTime) : 'Not logged out'}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerRecords;
