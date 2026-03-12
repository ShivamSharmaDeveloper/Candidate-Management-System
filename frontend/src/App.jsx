/**
 * App.jsx — Root Router
 * Defines all application routes for Admin and Candidate panels
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CandidateAuthProvider } from './context/CandidateAuthContext';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './components/AdminLayout';

// ─── Admin Pages ─────────────────────────────────────────────
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import CountryMaster from './pages/admin/CountryMaster';
import QualificationMaster from './pages/admin/QualificationMaster';
import DesignationMaster from './pages/admin/DesignationMaster';
import CandidateManagement from './pages/admin/CandidateManagement';

// ─── Candidate Pages ─────────────────────────────────────────
import RegisterStep1 from './pages/candidate/RegisterStep1';
import RegisterStep2 from './pages/candidate/RegisterStep2';
import ActivationPage from './pages/candidate/ActivationPage';
import CandidateLogin from './pages/candidate/CandidateLogin';
import CandidateDashboard from './pages/candidate/CandidateDashboard';

const App = () => {
  return (
    <AdminAuthProvider>
      <CandidateAuthProvider>
        <Router>
          <Routes>
            {/* ─── Default Redirect ──────────────────────── */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />

            {/* ─── Admin Auth ────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ─── Admin Protected Panel ─────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="countries" element={<CountryMaster />} />
              <Route path="qualifications" element={<QualificationMaster />} />
              <Route path="designations" element={<DesignationMaster />} />
              <Route path="candidates" element={<CandidateManagement />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ─── Candidate Public Routes ───────────────── */}
            <Route path="/register" element={<RegisterStep1 />} />
            <Route path="/register/step2" element={<RegisterStep2 />} />
            <Route path="/activate/:token" element={<ActivationPage />} />
            <Route path="/login" element={<CandidateLogin />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

            {/* ─── 404 ──────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Router>
      </CandidateAuthProvider>
    </AdminAuthProvider>
  );
};

export default App;
