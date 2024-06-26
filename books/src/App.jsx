import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import AddBook from './components/AddBook';
import BookRecords from './components/BookRecords';
import Wishlist from './components/Wishlist';
import CustomerRecords from './components/CustomerRecords';
import MyOrder from './components/MyOrder';
import OrderRecords from './components/OrderRecords';
import Feedback from './components/Feedback'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/book-records" element={<BookRecords />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path='/customer-records' element={<CustomerRecords />} />
        <Route path="/my-order" element={<MyOrder />} />
        <Route path="/order-records" element={<OrderRecords />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
}

export default App;
