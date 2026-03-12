/**
 * Candidate Auth Context
 * Manages candidate authentication state globally
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const CandidateAuthContext = createContext(null);

export const CandidateAuthProvider = ({ children }) => {
  const [candidate, setCandidate] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('candidateToken');
    const storedCandidate = localStorage.getItem('candidateUser');
    if (storedToken && storedCandidate) {
      setToken(storedToken);
      setCandidate(JSON.parse(storedCandidate));
    }
    setLoading(false);
  }, []);

  const login = (candidateData, authToken) => {
    localStorage.setItem('candidateToken', authToken);
    localStorage.setItem('candidateUser', JSON.stringify(candidateData));
    setToken(authToken);
    setCandidate(candidateData);
  };

  const logout = () => {
    localStorage.removeItem('candidateToken');
    localStorage.removeItem('candidateUser');
    setToken(null);
    setCandidate(null);
  };

  const isAuthenticated = !!token;

  return (
    <CandidateAuthContext.Provider value={{ candidate, token, loading, isAuthenticated, login, logout }}>
      {children}
    </CandidateAuthContext.Provider>
  );
};

export const useCandidateAuth = () => {
  const context = useContext(CandidateAuthContext);
  if (!context) throw new Error('useCandidateAuth must be used within CandidateAuthProvider');
  return context;
};
