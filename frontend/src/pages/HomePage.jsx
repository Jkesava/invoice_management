// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

const LOCAL_KEY = 'invoices';

export default function HomePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Load from localStorage first
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        setInvoices(JSON.parse(stored));
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Fetch from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter !== 'All') params.append('status', statusFilter);
        params.append('sortBy', sortBy);
        params.append('order', sortOrder);

        const data = await apiRequest(`/invoices?${params.toString()}`, {
          token,
        });
        setInvoices(data);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      } catch (err) {
        setServerError(err.message || 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [token, statusFilter, sortBy, sortOrder]);

  const handleDelete = async id => {
    const confirm = window.confirm('Delete this invoice?');
    if (!confirm) return;

    try {
      await apiRequest(`/invoices/${id}`, {
        method: 'DELETE',
        token,
      });
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    } catch (err) {
      alert(err.message || 'Failed to delete invoice');
    }
  };

  const handleCreateClick = () => {
    navigate('/invoices/new');
  };

  const formatAmount = val =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);

  const statusClass = status => {
    if (status === 'Paid') return 'badge paid';
    if (status === 'Unpaid') return 'badge unpaid';
    return 'badge pending';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Invoices</h2>
        <button onClick={handleCreateClick}>+ New Invoice</button>
      </div>

      <div className="filters-row">
        <div>
          <label>Status: </label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Paid</option>
            <option>Unpaid</option>
            <option>Pending</option>
          </select>
        </div>

        <div>
          <label>Sort by: </label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="invoice_number">Invoice Number</option>
          </select>

          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {serverError && <div className="error-banner">{serverError}</div>}
      {loading && <p>Loading invoices…</p>}

      {!loading && invoices.length === 0 && (
        <p>No invoices yet. Click “New Invoice” to add one.</p>
      )}

      {!loading && invoices.length > 0 && (
        <div className="table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.invoice_number}</td>
                  <td>{inv.client_name}</td>
                  <td>{inv.date}</td>
                  <td>{formatAmount(inv.amount)}</td>
                  <td>
                    <span className={statusClass(inv.status)}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/invoices/${inv.id}/edit`}>Edit</Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(inv.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

