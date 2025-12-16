import React, { useState, useEffect } from 'react';
import Navbar from '@theme/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import Link from '@docusaurus/Link';

const AuthNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="auth-navbar-wrapper">
      <Navbar />
      {/* Add user-specific elements that can be controlled via JavaScript */}
      {isAuthenticated && user && (
        <div className="user-menu-container" style={{ position: 'absolute', right: '20px', top: '20px' }}>
          <button
            onClick={toggleUserMenu}
            className="user-menu-button"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            👤 {user.username} ▼
          </button>
          {showUserMenu && (
            <div
              className="user-menu-dropdown"
              style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '150px'
              }}
            >
              <Link
                to="/dashboard"
                className="dropdown-item"
                style={{
                  display: 'block',
                  padding: '10px 15px',
                  textDecoration: 'none',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0'
                }}
                onClick={() => setShowUserMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/ai-chatbot"
                className="dropdown-item"
                style={{
                  display: 'block',
                  padding: '10px 15px',
                  textDecoration: 'none',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0'
                }}
                onClick={() => setShowUserMenu(false)}
              >
                AI Assistant
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="dropdown-item logout-button"
                style={{
                  width: '100%',
                  display: 'block',
                  padding: '10px 15px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  textDecoration: 'none',
                  color: '#1e293b',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthNavbar;