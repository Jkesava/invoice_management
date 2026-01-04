// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="navbar-brand" to={user ? '/' : '/login'}>
          Invoice Manager
        </Link>
      </div>

      <div className="navbar-right">
        {user && !isAuthPage && (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button className="navbar-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

