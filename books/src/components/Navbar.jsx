import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.jpeg';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-indigo-500 text-gray-100 shadow-md">
      <div className="flex items-center">
        <img className="h-10" src={logo} alt="logo" />
        <h4 className="ml-4 text-lg">Digital Library</h4>
      </div>
      <div className="flex items-center space-x-4">
        <Link className="text-sm hover:text-gray-400" to="/">Home</Link>
        <Link className="text-sm bg-green-500 hover:bg-green-400 text-white px-3 py-2 rounded" to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
