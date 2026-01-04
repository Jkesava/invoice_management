// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import InvoiceFormPage from './pages/InvoiceFormPage';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import './styles/auth.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices/new"
          element={
            <PrivateRoute>
              <InvoiceFormPage mode="create" />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices/:id/edit"
          element={
            <PrivateRoute>
              <InvoiceFormPage mode="edit" />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

