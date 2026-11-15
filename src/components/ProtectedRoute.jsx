import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminUser, useAuth } from '../context/authContextCore';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking session...</div>;
  }

  return isAdminUser(user) ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
