/**
 * Admin Layout — Persistent Sidebar + Top AppBar
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, IconButton,
  Avatar, Menu, MenuItem, Tooltip, Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAdminAuth } from '../context/AdminAuthContext';

const DRAWER_WIDTH = 260;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Country Master', icon: <PublicIcon />, path: '/admin/countries' },
  { text: 'Qualification Master', icon: <SchoolIcon />, path: '/admin/qualifications' },
  { text: 'Designation Master', icon: <WorkIcon />, path: '/admin/designations' },
  { text: 'Candidate Management', icon: <PeopleIcon />, path: '/admin/candidates' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #1565c0 0%, #0d47a1 100%)', color: '#fff' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700} color="#fff">
          🏢 CMS Admin
        </Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.7)">
          Management Portal
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Nav Items */}
      <List sx={{ px: 1, mt: 1 }}>
        {navItems.map(({ text, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>{icon}</ListItemIcon>
                <ListItemText primary={text} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400, color: '#fff' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, px: 1 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1 }} />
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,0,0,0.15)' } }}>
          <ListItemIcon sx={{ color: '#ff8a80', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: '#ff8a80', fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f4f8' }}>
      {/* Sidebar Desktop */}
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' }, display: { xs: 'none', md: 'block' } }}>
        {drawer}
      </Drawer>

      {/* Sidebar Mobile */}
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        {drawer}
      </Drawer>

      {/* Main Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top AppBar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ flexGrow: 1 }}>
              {navItems.find(n => n.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            <Chip label="Admin" color="primary" size="small" sx={{ mr: 2 }} />
            <Tooltip title={admin?.name || 'Admin'}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AccountCircleIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">{admin?.email}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
