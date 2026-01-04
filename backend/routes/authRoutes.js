const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { SECRET } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const hash = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)';
  db.run(sql, [name, email, hash], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      return res.status(500).json({ message: 'Error creating user' });
    }

    const user = { id: this.lastID, name, email };
    const token = jwt.sign({ id: user.id, email }, SECRET, { expiresIn: '1d' });
    res.status(201).json({ user, token });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'All fields required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(401).json({ message: 'Invalid credentials' });

    const match = bcrypt.compareSync(password, row.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const user = { id: row.id, name: row.name, email: row.email };
    const token = jwt.sign({ id: user.id, email }, SECRET, { expiresIn: '1d' });
    res.json({ user, token });
  });
});

module.exports = router;

