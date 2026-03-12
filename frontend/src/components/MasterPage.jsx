/**
 * Reusable Master Page Component
 * Used for Country, Qualification, and Designation Masters
 * Props: title, columns, fetchFn, createFn, updateFn, deleteFn, fields, color
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Alert, CircularProgress, Tooltip, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const MasterPage = ({ title, icon, fetchFn, createFn, updateFn, deleteFn, nameField, nameLabel, color = '#1976d2' }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState({ [nameField]: '', status: 'active' });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFn();
      setRows(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setForm({ [nameField]: '', status: 'active' });
    setFormErrors({});
    setApiError('');
    setDialog({ open: true, mode: 'add', data: null });
  };

  const openEdit = (row) => {
    setForm({ [nameField]: row[nameField], status: row.status });
    setFormErrors({});
    setApiError('');
    setDialog({ open: true, mode: 'edit', data: row });
  };

  const closeDialog = () => setDialog({ open: false, mode: 'add', data: null });

  const validate = () => {
    const errs = {};
    if (!form[nameField]?.trim()) errs[nameField] = `${nameLabel} is required.`;
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) return setFormErrors(errs);
    setSaving(true);
    try {
      if (dialog.mode === 'add') {
        await createFn(form);
      } else {
        await updateFn(dialog.data.id, form);
      }
      closeDialog();
      fetchData();
    } catch (e) {
      setApiError(e.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (row) => setDeleteDialog({ open: true, id: row.id, name: row[nameField] });

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFn(deleteDialog.id);
      setDeleteDialog({ open: false, id: null, name: '' });
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = rows.filter(r => r[nameField]?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box className="fade-in">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{icon} {title}</Typography>
          <Typography variant="body2" color="text.secondary">Manage {title.toLowerCase()} entries</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ bgcolor: color, '&:hover': { bgcolor: color + 'cc' } }}>
          Add {nameLabel}
        </Button>
      </Box>

      <Card>
        <CardContent>
          {/* Search */}
          <TextField
            size="small" placeholder={`Search ${nameLabel}...`} value={search}
            onChange={e => setSearch(e.target.value)} sx={{ mb: 2, width: 300 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
          />

          {/* Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{nameLabel}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No records found.</TableCell></TableRow>
                ) : (
                  filtered.map((row, idx) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{row[nameField]}</TableCell>
                      <TableCell>
                        <Chip label={row.status} size="small" color={row.status === 'active' ? 'success' : 'default'} />
                      </TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => confirmDelete(row)}><DeleteIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialog.mode === 'add' ? `Add ${nameLabel}` : `Edit ${nameLabel}`}
          <IconButton size="small" onClick={closeDialog}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          <TextField
            fullWidth label={nameLabel} name={nameField}
            value={form[nameField]} onChange={e => { setForm({ ...form, [nameField]: e.target.value }); setFormErrors({}); }}
            error={!!formErrors[nameField]} helperText={formErrors[nameField]}
            margin="normal" autoFocus
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeDialog} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : (dialog.mode === 'add' ? 'Add' : 'Update')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{deleteDialog.name}</strong>? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterPage;
