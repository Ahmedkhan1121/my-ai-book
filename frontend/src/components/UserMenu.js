import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from '@docusaurus/Link';

const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !user) {
    return null; // Don't render if not authenticated
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={menuRef} className="user-menu-container">
      <button
        onClick={toggleMenu}
        className="user-menu-button navbar__item navbar__link"
        style={{
          color: 'inherit',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease'
        }}
        aria-expanded={isOpen}
      >
        👤 {user.username} {isOpen ? '▲' : '▼'}
      </button>

      {isOpen && (
        <div
          className="user-menu-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: '180px',
            marginTop: '0.5rem'
          }}
        >
          <Link
            to="/dashboard"
            className="dropdown-item navbar__link"
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: '#1e293b',
              borderBottom: '1px solid #e2e8f0',
              transition: 'background-color 0.2s ease'
            }}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="dropdown-item navbar__link"
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: '#1e293b',
              borderBottom: '1px solid #e2e8f0',
              transition: 'background-color 0.2s ease'
            }}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/ai-chatbot"
            className="dropdown-item navbar__link"
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: '#1e293b',
              borderBottom: '1px solid #e2e8f0',
              transition: 'background-color 0.2s ease'
            }}
            onClick={() => setIsOpen(false)}
          >
            AI Assistant
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="dropdown-item logout-button navbar__link"
            style={{
              width: '100%',
              display: 'block',
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              textAlign: 'left',
              textDecoration: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;