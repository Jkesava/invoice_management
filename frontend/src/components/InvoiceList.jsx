// src/components/InvoiceList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function InvoiceList({ invoices, onDelete }) {
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

  if (!invoices.length) {
    return <p>No invoices found.</p>;
  }

  return (
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
                <span className={statusClass(inv.status)}>{inv.status}</span>
              </td>
              <td className="actions-cell">
                <Link to={`/invoices/${inv.id}/edit`}>Edit</Link>
                <button type="button" onClick={() => onDelete(inv.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

