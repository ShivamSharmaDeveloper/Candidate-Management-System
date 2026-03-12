/**
 * Protected Admin Route
 * Redirects to /admin/login if not authenticated
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
