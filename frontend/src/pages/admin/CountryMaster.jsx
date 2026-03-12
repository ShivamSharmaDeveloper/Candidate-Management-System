/**
 * Country Master Page
 */

import React from 'react';
import MasterPage from '../../components/MasterPage';
import API from '../../api/axios';

const CountryMaster = () => (
  <MasterPage
    title="Country Master"
    icon="🌍"
    nameField="countryName"
    nameLabel="Country Name"
    color="#9c27b0"
    fetchFn={async () => { const res = await API.get('/countries'); return res.data.data; }}
    createFn={async (data) => API.post('/countries', data)}
    updateFn={async (id, data) => API.put(`/countries/${id}`, data)}
    deleteFn={async (id) => API.delete(`/countries/${id}`)}
  />
);

export default CountryMaster;
