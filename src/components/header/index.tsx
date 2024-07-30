import React from 'react';
import { useAuth } from '../../context/auth.context';

const Header: React.FC = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Video App</h1>
      {isAuthenticated ? (
        <div className="flex items-center">
          <span className="mr-4">{userEmail}</span>
          <button 
            onClick={logout} 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <a href="/login" className="text-blue-500 hover:text-blue-700">Login</a>
        </div>
      )}
    </header>
  );
};

export default Header;
