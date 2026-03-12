/**
 * Candidate Registration — Step 2 (Professional Details)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, InputAdornment,
  IconButton, Stepper, Step, StepLabel, FormHelperText,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import API from '../../api/axios';

const RegisterStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const step1Data = location.state;

  const [form, setForm] = useState({ countryId: '', qualificationId: '', designationId: '', password: '', confirmPassword: '' });
  const [countries, setCountries] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    // Redirect to step1 if no state
    if (!step1Data) { navigate('/register'); return; }
    Promise.all([API.get('/countries'), API.get('/qualifications'), API.get('/designations')]).then(([c, q, d]) => {
      setCountries(c.data.data || []);
      setQualifications(q.data.data || []);
      setDesignations(d.data.data || []);
    });
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.countryId) errs.countryId = 'Country is required.';
    if (!form.qualificationId) errs.qualificationId = 'Qualification is required.';
    if (!form.designationId) errs.designationId = 'Designation is required.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) errs.password = 'Must include uppercase, lowercase, and number.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      await API.post('/candidates/register/step2', { ...step1Data, ...form });
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-bg">
        <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#2e7d32', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} color="#2e7d32">Registration Successful!</Typography>
          <Typography variant="body1" mt={2} color="text.secondary">
            We've sent an activation link to <strong>{step1Data?.email}</strong>. Please check your inbox and click the link to activate your account.
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight={700}>Candidate Registration</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Step 2 of 2 — Professional Details</Typography>
        </Box>

        <Stepper activeStep={1} sx={{ mb: 3 }}>
          <Step><StepLabel>Basic Details</StepLabel></Step>
          <Step><StepLabel>Professional Details</StepLabel></Step>
        </Stepper>

        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Country */}
          <FormControl fullWidth margin="normal" error={!!errors.countryId}>
            <InputLabel>Country</InputLabel>
            <Select label="Country" name="countryId" value={form.countryId} onChange={handleChange}>
              {countries.filter(c => c.status === 'active').map(c => <MenuItem key={c.id} value={c.id}>{c.countryName}</MenuItem>)}
            </Select>
            {errors.countryId && <FormHelperText>{errors.countryId}</FormHelperText>}
          </FormControl>

          {/* Qualification */}
          <FormControl fullWidth margin="normal" error={!!errors.qualificationId}>
            <InputLabel>Qualification</InputLabel>
            <Select label="Qualification" name="qualificationId" value={form.qualificationId} onChange={handleChange}>
              {qualifications.filter(q => q.status === 'active').map(q => <MenuItem key={q.id} value={q.id}>{q.qualName}</MenuItem>)}
            </Select>
            {errors.qualificationId && <FormHelperText>{errors.qualificationId}</FormHelperText>}
          </FormControl>

          {/* Designation */}
          <FormControl fullWidth margin="normal" error={!!errors.designationId}>
            <InputLabel>Designation</InputLabel>
            <Select label="Designation" name="designationId" value={form.designationId} onChange={handleChange}>
              {designations.filter(d => d.status === 'active').map(d => <MenuItem key={d.id} value={d.id}>{d.desigName}</MenuItem>)}
            </Select>
            {errors.designationId && <FormHelperText>{errors.designationId}</FormHelperText>}
          </FormControl>

          {/* Password */}
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
          <TextField
            fullWidth label="Confirm Password" name="confirmPassword" type="password"
            value={form.confirmPassword} onChange={handleChange}
            error={!!errors.confirmPassword} helperText={errors.confirmPassword}
            margin="normal"
          />

          <Box display="flex" gap={2} mt={3}>
            <Button fullWidth variant="outlined" onClick={() => navigate('/register')}>← Back</Button>
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default RegisterStep2;
