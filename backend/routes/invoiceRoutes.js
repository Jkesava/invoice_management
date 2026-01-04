const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const userId = req.user.id;
  const { status, sortBy = 'date', order = 'desc' } = req.query;

  const allowedSort = ['date', 'amount', 'invoice_number', 'created_at'];
  const sort = allowedSort.includes(sortBy) ? sortBy : 'date';
  const ord = order === 'asc' ? 'ASC' : 'DESC';

  const params = [userId];
  let where = 'WHERE user_id = ?';

  if (status && ['Paid', 'Unpaid', 'Pending'].includes(status)) {
    where += ' AND status = ?';
    params.push(status);
  }

  const sql = `
    SELECT * FROM invoices
    ${where}
    ORDER BY ${sort} ${ord}
  `;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const userId = req.user.id;
  const { invoiceNumber, clientName, date, amount, status } = req.body;

  if (!invoiceNumber || !clientName || !date || !amount || !status) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const sql = `
    INSERT INTO invoices
    (user_id, invoice_number, client_name, date, amount, status)
    VALUES (?,?,?,?,?,?)
  `;

  db.run(sql, [userId, invoiceNumber, clientName, date, amount, status], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ message: 'Invoice number already exists' });
      }
      return res.status(500).json({ message: 'Error creating invoice' });
    }
    res.status(201).json({
      id: this.lastID,
      user_id: userId,
      invoice_number: invoiceNumber,
      client_name: clientName,
      date,
      amount,
      status
    });
  });
});

router.put('/:id', (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { invoiceNumber, clientName, date, amount, status } = req.body;

  const sql = `
    UPDATE invoices
    SET invoice_number = ?, client_name = ?, date = ?, amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `;

  db.run(sql, [invoiceNumber, clientName, date, amount, status, id, userId], function (err) {
    if (err) return res.status(500).json({ message: 'Error updating invoice' });
    if (this.changes === 0) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Updated' });
  });
});

router.delete('/:id', (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.run('DELETE FROM invoices WHERE id = ? AND user_id = ?', [id, userId], function (err) {
    if (err) return res.status(500).json({ message: 'Error deleting invoice' });
    if (this.changes === 0) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;

