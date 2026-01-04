import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username: 'eliane', token: 'fake-token' }

  useEffect(() => {
    // Check for a token in localStorage on initial load
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
