/**
 * Qualification Master Page
 */

import React from 'react';
import MasterPage from '../../components/MasterPage';
import API from '../../api/axios';

const QualificationMaster = () => (
  <MasterPage
    title="Qualification Master"
    icon="🎓"
    nameField="qualName"
    nameLabel="Qualification Name"
    color="#0288d1"
    fetchFn={async () => { const res = await API.get('/qualifications'); return res.data.data; }}
    createFn={async (data) => API.post('/qualifications', data)}
    updateFn={async (id, data) => API.put(`/qualifications/${id}`, data)}
    deleteFn={async (id) => API.delete(`/qualifications/${id}`)}
  />
);

export default QualificationMaster;
