import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Modal display state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Toast notifications for user feedback
  const [authToast, setAuthToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setAuthToast({ id: Date.now(), message, type });
  }, []);

  const clearToast = useCallback(() => {
    setAuthToast(null);
  }, []);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (authToast) {
      const timer = setTimeout(() => {
        setAuthToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [authToast]);

  // Synchronize authentication on initial mount
  useEffect(() => {
    async function syncAuth() {
      let authenticated = false;

      if (authService.getToken()) {
        try {
          const freshUser = await authService.getMe();
          if (freshUser) {
            setUser(freshUser);
            setToken(authService.getToken());
            authenticated = true;
          } else {
            setUser(null);
            setToken(null);
          }
        } catch {
          // Token invalid or expired
          setUser(null);
          setToken(null);
        }
      }

      setIsLoading(false);
    }

    syncAuth();
  }, []);

  const openLoginModal = useCallback(() => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  }, []);

  const openSignupModal = useCallback(() => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = async ({ email, password }) => {
    const result = await authService.login({ email, password });
    setUser(result.user);
    setToken(result.token);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${result.user?.name || 'User'}!`, 'success');
    return result;
  };

  const signup = async ({ name, email, password, role }) => {
    const result = await authService.signup({ name, email, password, role });
    if (result.token && result.user) {
      setUser(result.user);
      setToken(result.token);
      setIsAuthModalOpen(false);
      showToast(`Account created successfully! Welcome, ${result.user.name}.`, 'success');
    } else {
      // Switched to login if backend requires separate login
      setAuthModalMode('login');
      showToast('Account created! Please log in with your credentials.', 'success');
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    showToast('You have been signed out successfully.', 'info');
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    isAuthModalOpen,
    authModalMode,
    authToast,
    openLoginModal,
    openSignupModal,
    closeAuthModal,
    setAuthModalMode,
    login,
    signup,
    logout,
    showToast,
    clearToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
