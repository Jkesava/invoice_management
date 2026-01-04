// src/pages/InvoiceFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

export default function InvoiceFormPage({ mode }) {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    invoiceNumber: '',
    clientName: '',
    date: '',
    amount: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(isEdit);

  // Load existing invoice when editing
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchInvoice = async () => {
      try {
        setLoadingInvoice(true);
        // Could also fetch /invoices then find; here assume you add GET /invoices/:id
        const data = await apiRequest(`/invoices`, { token });
        const found = data.find(inv => String(inv.id) === String(id));
        if (!found) {
          setServerError('Invoice not found');
        } else {
          setForm({
            invoiceNumber: found.invoice_number,
            clientName: found.client_name,
            date: found.date,
            amount: found.amount,
            status: found.status,
          });
        }
      } catch (err) {
        setServerError(err.message || 'Failed to load invoice');
      } finally {
        setLoadingInvoice(false);
      }
    };

    fetchInvoice();
  }, [isEdit, id, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.invoiceNumber.trim()) errs.invoiceNumber = 'Invoice number required';
    if (!form.clientName.trim()) errs.clientName = 'Client name required';
    if (!form.date) errs.date = 'Date required';
    if (!form.amount) errs.amount = 'Amount required';
    else if (Number(form.amount) <= 0) errs.amount = 'Amount must be positive';
    if (!['Paid', 'Unpaid', 'Pending'].includes(form.status)) {
      errs.status = 'Invalid status';
    }
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      invoiceNumber: form.invoiceNumber,
      clientName: form.clientName,
      date: form.date,
      amount: Number(form.amount),
      status: form.status,
    };

    try {
      setLoading(true);
      if (isEdit) {
        await apiRequest(`/invoices/${id}`, {
          method: 'PUT',
          body: payload,
          token,
        });
      } else {
        await apiRequest('/invoices', {
          method: 'POST',
          body: payload,
          token,
        });
      }
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const title = isEdit ? 'Edit Invoice' : 'New Invoice';

  if (loadingInvoice) {
    return (
      <div className="page-container">
        <p>Loading invoice…</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>{title}</h2>

      {serverError && <div className="error-banner">{serverError}</div>}

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="invoiceNumber">Invoice Number</label>
            <input
              id="invoiceNumber"
              name="invoiceNumber"
              type="text"
              value={form.invoiceNumber}
              onChange={handleChange}
            />
            {errors.invoiceNumber && (
              <div className="field-error">{errors.invoiceNumber}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="clientName">Client Name</label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              value={form.clientName}
              onChange={handleChange}
            />
            {errors.clientName && (
              <div className="field-error">{errors.clientName}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <div className="field-error">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
            />
            {errors.amount && (
              <div className="field-error">{errors.amount}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
            </select>
            {errors.status && (
              <div className="field-error">{errors.status}</div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

