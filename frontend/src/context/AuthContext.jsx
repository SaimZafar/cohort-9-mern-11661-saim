import { createContext, useContext, useState, useMemo } from 'react';
import * as api from '../api/api';

const AuthContext = createContext(null);

// Wraps the whole app so any component can access the logged-in user,
// their token, and login/signup/logout functions without prop-drilling.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function saveSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function signup(name, email, password) {
    const data = await api.signup(name, email, password);
    saveSession(data);
  }

  async function login(email, password) {
    const data = await api.login(email, password);
    saveSession(data);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      signup,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components just do: const { user, login } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}