import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();

export const isAdminUser = (user) =>
  Boolean(adminEmail) && user?.email?.trim().toLowerCase() === adminEmail;

export const useAuth = () => useContext(AuthContext);
