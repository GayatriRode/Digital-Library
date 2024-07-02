import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      const { userId, userType } = data; // Assuming backend returns userId and userType
      localStorage.setItem('userId', userId);

      if (userType === 'admin') {
        navigate('/admin-dashboard');
      } else if (userType === 'customer') {
        navigate('/customer-dashboard', { state: { userId } }); // Pass userId to dashboard
      } else {
        throw new Error('Role not recognized');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg overflow-hidden flex w-3/4 shadow-lg">
        <div className="w-1/2">
          <img
            src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7863.jpg?size=626&ext=jpg&ga=GA1.1.980550786.1713343498&semt=sph"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-4">
            <p className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
