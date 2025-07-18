import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/api'; // Adjust the path based on your file structure

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         // ✅ Use the centralized logout function
    navigate('/');    // ✅ Redirect to login page
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Company Name */}
        <h1 className="text-xl font-bold text-blue-700 tracking-wide">Kalkitech</h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}