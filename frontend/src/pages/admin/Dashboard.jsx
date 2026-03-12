/**
 * Admin Dashboard Page
 */

import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, CircularProgress, Avatar,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import API from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const StatCard = ({ icon, label, value, color, loading }) => (
  <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}30` }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: color, width: 52, height: 52 }}>{icon}</Avatar>
      <Box>
        <Typography variant="h4" fontWeight={700} color={color}>
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState({ countries: 0, qualifications: 0, designations: 0, candidates: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [countries, quals, desigs, candidates] = await Promise.all([
          API.get('/countries'),
          API.get('/qualifications'),
          API.get('/designations'),
          API.get('/candidates'),
        ]);
        const candidateList = candidates.data.data || [];
        setStats({
          countries: countries.data.data?.length || 0,
          qualifications: quals.data.data?.length || 0,
          designations: desigs.data.data?.length || 0,
          candidates: candidateList.length,
          active: candidateList.filter(c => c.status === 'active').length,
          pending: candidateList.filter(c => c.status === 'pending').length,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box className="fade-in">
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700}>
          Welcome back, {admin?.name || 'Admin'} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Here's an overview of your system
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<PeopleIcon />} label="Total Candidates" value={stats.candidates} color="#1976d2" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<CheckCircleIcon />} label="Active Candidates" value={stats.active} color="#2e7d32" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<HourglassEmptyIcon />} label="Pending Activation" value={stats.pending} color="#ed6c02" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<PublicIcon />} label="Countries" value={stats.countries} color="#9c27b0" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<SchoolIcon />} label="Qualifications" value={stats.qualifications} color="#0288d1" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<WorkIcon />} label="Designations" value={stats.designations} color="#d32f2f" loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
