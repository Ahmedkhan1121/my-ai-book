import React, { createContext, useContext, useReducer, useEffect } from 'react';

// API configuration
const API_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/api`
  : process.env.API_BASE_URL || 'http://localhost:8000/api';

// Auth context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing tokens on initial load
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      // Verify token and get user info
      const verifyToken = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const user = await response.json();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user,
                accessToken,
                refreshToken
              }
            });
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      };

      verifyToken();
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);

        // Get user info
        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });

        if (userResponse.ok) {
          const user = await userResponse.json();

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              accessToken: data.access_token,
              refreshToken: data.refresh_token
            }
          });

          return { success: true };
        } else {
          throw new Error('Failed to get user info');
        }
      } else {
        throw new Error(data.detail || 'Login failed');
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    dispatch({ type: 'LOGOUT' });
  };

  // Register function
  const register = async (username, email, password) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);

        // Get user info
        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });

        if (userResponse.ok) {
          const user = await userResponse.json();

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              accessToken: data.access_token,
              refreshToken: data.refresh_token
            }
          });

          return { success: true };
        } else {
          throw new Error('Failed to get user info after registration');
        }
      } else {
        throw new Error(data.detail || 'Registration failed');
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};