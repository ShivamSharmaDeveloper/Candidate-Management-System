/**
 * Axios Instance Configuration
 * Automatically attaches JWT token from localStorage to every request
 */

import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — attach token ──────────────────────
API.interceptors.request.use((config) => {
  // Check for admin token first, then candidate token
  const adminToken = localStorage.getItem('adminToken');
  const candidateToken = localStorage.getItem('candidateToken');
  const token = adminToken || candidateToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor — handle 401 ──────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('candidateToken');
      localStorage.removeItem('candidateUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default API;
