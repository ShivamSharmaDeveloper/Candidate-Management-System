/**
 * Account Activation Page
 * Called when candidate clicks activation link in email
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import API from '../../api/axios';
import { useRef } from 'react';

const ActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const isFetching = useRef(false);

  useEffect(() => {
    debugger
    const activate = async () => {
      try {
        if (isFetching.current) return;
        isFetching.current = true;
        const res = await API.get(`/candidates/activate/${token}`);
        setMessage(res.data.message);
        setStatus('success');
        isFetching.current = false;
      } catch (err) {
        setMessage(err.response?.data?.message || 'Activation failed. The link may be invalid or expired.');
        setStatus('error');
        isFetching.current = false;
      }
    };
    activate();
  }, [token]);

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">Activating your account...</Typography>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 72, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color="#2e7d32">Account Activated! 🎉</Typography>
            <Typography variant="body1" mt={1} color="text.secondary">{message}</Typography>
            <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 72, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color="#d32f2f">Activation Failed</Typography>
            <Typography variant="body1" mt={1} color="text.secondary">{message}</Typography>
            <Button variant="outlined" sx={{ mt: 4, mr: 1 }} onClick={() => navigate('/register')}>Register Again</Button>
            <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate('/login')}>Go to Login</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;
