import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthNavigationHandler = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const updateNavigation = () => {
      // Update body class based on auth status
      if (isAuthenticated) {
        document.body.classList.add('authenticated');
        document.body.classList.remove('guest');
      } else {
        document.body.classList.add('guest');
        document.body.classList.remove('authenticated');
      }

      // Update navbar items visibility
      const dashboardLink = document.querySelector('.navbar-item[href="/dashboard"]');
      const loginLink = document.querySelector('.navbar-item[href="/auth/login"]');

      if (dashboardLink && loginLink) {
        if (isAuthenticated) {
          dashboardLink.style.display = 'block';
          loginLink.style.display = 'none';
        } else {
          dashboardLink.style.display = 'none';
          loginLink.style.display = 'block';
        }
      }
    };

    // Initial update
    updateNavigation();

    // Set up a simple observer to watch for changes to the auth state
    // Since we can't directly hook into the React context from here,
    // we'll update when the page is loaded or when the component mounts
    const interval = setInterval(updateNavigation, 1000); // Check every second

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return null;
};

export default AuthNavigationHandler;