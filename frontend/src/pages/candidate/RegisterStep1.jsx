/**
 * Candidate Registration — Step 1 (Basic Details)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert,
  InputAdornment, CircularProgress, Stepper, Step, StepLabel,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import API from '../../api/axios';

const RegisterStep1 = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address.';
    if (!form.phone.trim()) errs.phone = 'Phone is required.';
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) errs.phone = 'Invalid phone number.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      await API.post('/candidates/register/step1', form);
      // Move to step 2 with form data via location state
      navigate('/register/step2', { state: form });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <Box textAlign="center" mb={3}>
          <AppRegistrationIcon sx={{ fontSize: 52, color: '#1976d2' }} />
          <Typography variant="h5" fontWeight={700}>Candidate Registration</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Step 1 of 2 — Basic Details</Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={0} sx={{ mb: 3 }}>
          <Step><StepLabel>Basic Details</StepLabel></Step>
          <Step><StepLabel>Professional Details</StepLabel></Step>
        </Stepper>

        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

        <form onSubmit={handleNext} noValidate>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth label="First Name" name="firstName" value={form.firstName}
              onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName}
              margin="normal"
              placeholder='Enter first name'
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Last Name" name="lastName" value={form.lastName}
              placeholder='Enter last name'
              onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName}
              margin="normal"
            />
          </Box>
          <TextField
            fullWidth label="Email Address" name="email" type="email" value={form.email}
            onChange={handleChange} error={!!errors.email} helperText={errors.email}
            margin="normal"
            placeholder='Enter email address'
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
          />
          <TextField
            fullWidth label="Phone Number" name="phone" value={form.phone}
            placeholder='Enter phone number'
            onChange={handleChange} error={!!errors.phone} helperText={errors.phone}
            margin="normal"
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment> }}
          />
          <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 3, py: 1.4 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Next →'}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Button variant="text" size="small" onClick={() => navigate('/login')}>Login</Button>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default RegisterStep1;
