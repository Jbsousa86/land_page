import React, { useState } from 'react';
import { AuthContext } from './authContextCore';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('adminUser');
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('adminUser');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser); // { username: 'eliane', token: 'fake-token' }

  const login = (username, password) => {
    // In a real application, you'd send these credentials to a backend
    // and receive a token or user object upon successful authentication.
    
    // Ler variáveis de ambiente (Vite usa import.meta.env)
    // Usa valores padrão (fallback) para testes locais caso as variáveis não estejam definidas
    //const envUser = import.meta.env.VITE_ADMIN_USERNAME;
    //const envPass = import.meta.env.VITE_ADMIN_PASSWORD;
    const envUser = import.meta.env.VITE_ADMIN_USERNAME || 'eliane';
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (username === envUser && password === envPass) { 
      const authenticatedUser = { username: envUser, token: 'fake-admin-token' };
      setUser(authenticatedUser);
      localStorage.setItem('adminUser', JSON.stringify(authenticatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const verifyPassword = (password) => {
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    return password === envPass;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, verifyPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
