/**
 * Candidate Login Page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import API from '../../api/axios';
import { useCandidateAuth } from '../../context/CandidateAuthContext';

const CandidateLogin = () => {
  const navigate = useNavigate();
  const { login } = useCandidateAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiErrorSeverity, setApiErrorSeverity] = useState('error');
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
      const res = await API.post('/auth/candidate/login', form);
      login(res.data.candidate, res.data.token);
      navigate('/candidate/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      const status = err.response?.status;
      setApiErrorSeverity(status === 403 ? 'warning' : 'error');
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in">
        <Box textAlign="center" mb={4}>
          <AccountCircleIcon sx={{ fontSize: 56, color: '#1976d2', mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>Candidate Login</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Access your candidate portal</Typography>
        </Box>

        {apiError && <Alert severity={apiErrorSeverity} sx={{ mb: 2, borderRadius: 2 }}>{apiError}</Alert>}

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
              endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} edge="end">{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
            }}
          />
          <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 3, py: 1.4, fontSize: '1rem' }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button variant="text" size="small" onClick={() => navigate('/register')}>Register Now</Button>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default CandidateLogin;
