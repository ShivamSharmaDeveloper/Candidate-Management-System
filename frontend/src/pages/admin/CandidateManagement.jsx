/**
 * Candidate Management Page (Admin)
 * Full CRUD with dropdowns for Country, Qualification, Designation
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Alert, CircularProgress, Tooltip, InputAdornment, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import API from '../../api/axios';

const defaultForm = {
  firstName: '', lastName: '', email: '', phone: '',
  countryId: '', qualificationId: '', designationId: '', status: 'active',
};

const statusColor = { active: 'success', inactive: 'default', pending: 'warning' };

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [c, q, d, cands] = await Promise.all([
        API.get('/countries'), API.get('/qualifications'),
        API.get('/designations'), API.get('/candidates'),
      ]);
      setCountries(c.data.data || []);
      setQualifications(q.data.data || []);
      setDesignations(d.data.data || []);
      setCandidates(cands.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => { setForm(defaultForm); setFormErrors({}); setApiError(''); setDialog({ open: true, mode: 'add', data: null }); };
  const openEdit = (row) => {
    setForm({
      firstName: row.firstName, lastName: row.lastName, email: row.email, phone: row.phone,
      countryId: row.country?.id || '', qualificationId: row.qualification?.id || '',
      designationId: row.designation?.id || '', status: row.status,
    });
    setFormErrors({}); setApiError('');
    setDialog({ open: true, mode: 'edit', data: row });
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email.';
    if (!form.phone.trim()) errs.phone = 'Phone is required.';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) return setFormErrors(errs);
    setSaving(true);
    try {
      if (dialog.mode === 'add') await API.post('/candidates', form);
      else await API.put(`/candidates/${dialog.data.id}`, form);
      setDialog({ open: false, mode: 'add', data: null });
      fetchAll();
    } catch (e) { setApiError(e.response?.data?.message || 'Operation failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/candidates/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null, name: '' });
      fetchAll();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const filtered = candidates.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="fade-in">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>👤 Candidate Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage all registered candidates</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Candidate</Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            size="small" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)} sx={{ mb: 2, width: 340 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
          />
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  {['#', 'Name', 'Email', 'Phone', 'Country', 'Qualification', 'Designation', 'Status', 'Created', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} align="center" sx={{ py: 4 }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>No candidates found.</TableCell></TableRow>
                ) : filtered.map((c, i) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{c.firstName} {c.lastName}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.country?.countryName || '—'}</TableCell>
                    <TableCell>{c.qualification?.qualName || '—'}</TableCell>
                    <TableCell>{c.designation?.desigName || '—'}</TableCell>
                    <TableCell><Chip label={c.status} size="small" color={statusColor[c.status] || 'default'} /></TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, id: c.id, name: `${c.firstName} ${c.lastName}` })}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialog.mode === 'add' ? 'Add Candidate' : 'Edit Candidate'}
          <IconButton size="small" onClick={() => setDialog({ open: false })}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          <Grid container spacing={2} mt={0}>
            {[['firstName', 'First Name'], ['lastName', 'Last Name'], ['email', 'Email', 'email'], ['phone', 'Phone']].map(([field, label, type]) => (
              <Grid item xs={6} key={field}>
                <TextField fullWidth label={label} type={type || 'text'} value={form[field]}
                  onChange={e => { setForm({ ...form, [field]: e.target.value }); setFormErrors({ ...formErrors, [field]: '' }); }}
                  error={!!formErrors[field]} helperText={formErrors[field]} size="small" />
              </Grid>
            ))}
            {[
              ['countryId', 'Country', countries, 'countryName'],
              ['qualificationId', 'Qualification', qualifications, 'qualName'],
              ['designationId', 'Designation', designations, 'desigName'],
            ].map(([field, label, items, nameKey]) => (
              <Grid item xs={6} key={field}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select label={label} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}>
                    <MenuItem value="">None</MenuItem>
                    {items.map(i => <MenuItem key={i.id} value={i.id}>{i[nameKey]}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialog({ open: false })} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : (dialog.mode === 'add' ? 'Add' : 'Update')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Delete <strong>{deleteDialog.name}</strong>? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false })} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CandidateManagement;
