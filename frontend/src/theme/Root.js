import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

// Root component that wraps the entire app
export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}