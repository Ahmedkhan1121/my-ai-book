import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import AuthNavigationHandler from '../components/AuthNavigationHandler';

// Root component that wraps the entire app
export default function Root({ children }) {
  return (
    <AuthProvider>
      <AuthNavigationHandler />
      {children}
    </AuthProvider>
  );
}