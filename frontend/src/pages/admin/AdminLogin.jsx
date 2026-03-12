/**
 * Admin Login Page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import API from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const res = await API.post('/auth/admin/login', form);
      login(res.data.admin, res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <AdminPanelSettingsIcon sx={{ fontSize: 56, color: '#1976d2', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="text.primary">Admin Portal</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Sign in to manage the system
          </Typography>
        </Box>

        {apiError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{apiError}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth label="Email Address" name="email" type="email"
            value={form.email} onChange={handleChange}
            error={!!errors.email} helperText={errors.email}
            margin="normal"
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
          />
          <TextField
            fullWidth label="Password" name="password" type={showPass ? 'text' : 'password'}
            value={form.password} onChange={handleChange}
            error={!!errors.password} helperText={errors.password}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth type="submit" variant="contained" size="large" disabled={loading}
            sx={{ mt: 3, py: 1.4, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Default credentials: admin@example.com / Admin@123
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default AdminLogin;
