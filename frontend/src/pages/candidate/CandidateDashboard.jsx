/**
 * Candidate Dashboard
 * Simple profile view after successful login
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Avatar,
  Grid, Chip, Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useCandidateAuth } from '../../context/CandidateAuthContext';

const CandidateDashboard = () => {
  const { candidate, logout } = useCandidateAuth();
  const navigate = useNavigate();

  if (!candidate) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => { logout(); navigate('/login'); };

  const fields = [
    { label: 'First Name', value: candidate.firstName },
    { label: 'Last Name', value: candidate.lastName },
    { label: 'Email', value: candidate.email },
    { label: 'Phone', value: candidate.phone },
    { label: 'Country', value: candidate.country?.countryName || '—' },
    { label: 'Qualification', value: candidate.qualification?.qualName || '—' },
    { label: 'Designation', value: candidate.designation?.desigName || '—' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f4f8', p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700} color="primary">Candidate Portal</Typography>
        <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
      </Box>

      <Card className="fade-in" sx={{ maxWidth: 700, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Profile Header */}
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', fontSize: 28 }}>
              {candidate.firstName?.[0]}{candidate.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {candidate.firstName} {candidate.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">{candidate.email}</Typography>
              <Chip
                label={candidate.status?.toUpperCase()}
                color={candidate.status === 'active' ? 'success' : 'warning'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Profile Details */}
          <Typography variant="subtitle1" fontWeight={600} mb={2}>Profile Information</Typography>
          <Grid container spacing={2}>
            {fields.map(({ label, value }) => (
              <Grid item xs={12} sm={6} key={label}>
                <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                  <Typography variant="body1" fontWeight={500}>{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CandidateDashboard;
