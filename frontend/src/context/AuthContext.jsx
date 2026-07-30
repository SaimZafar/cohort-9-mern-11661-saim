import { createContext, useContext, useState, useMemo } from 'react';
import * as api from '../api/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  function isValidUser(value) {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof value.id !== 'undefined' &&
      typeof value.email === 'string'
    );
  }
  function clearStoredSession() {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch {
      /* storage unavailable, nothing more to do */
    }
  }
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (!savedUser || !savedToken) {
        clearStoredSession();
        return null;
      }
      const parsed = JSON.parse(savedUser);
      if (!isValidUser(parsed)) {
        clearStoredSession();
        return null;
      }
      return parsed;
    } catch {
      clearStoredSession();
      return null;
    }
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
export function useAuth() {
  return useContext(AuthContext);
}