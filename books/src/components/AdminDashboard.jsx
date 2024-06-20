import React from 'react';
import logo from '../images/logo.jpeg';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
        <div className="flex items-center">
          <img className="h-10" src={logo} alt="logo" />
          <h4 className="ml-4 text-lg px-6">Digital Library</h4>
        </div>
        <div className="flex items-center space-x-4">
          <Link className="text-sm hover:text-gray-400" to="/">Home</Link>
          <Link className="text-sm hover:text-gray-400" to="/add-book">Add Book</Link>
          <Link className="text-sm hover:text-gray-400" to="/book-records">Book Records</Link>
          <button onClick={() => navigate('/')} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
