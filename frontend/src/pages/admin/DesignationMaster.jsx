/**
 * Designation Master Page
 */

import React from 'react';
import MasterPage from '../../components/MasterPage';
import API from '../../api/axios';

const DesignationMaster = () => (
  <MasterPage
    title="Designation Master"
    icon="💼"
    nameField="desigName"
    nameLabel="Designation Name"
    color="#d32f2f"
    fetchFn={async () => { const res = await API.get('/designations'); return res.data.data; }}
    createFn={async (data) => API.post('/designations', data)}
    updateFn={async (id, data) => API.put(`/designations/${id}`, data)}
    deleteFn={async (id) => API.delete(`/designations/${id}`)}
  />
);

export default DesignationMaster;
