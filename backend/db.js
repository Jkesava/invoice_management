// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_FILE = process.env.DB_FILE || 'db.sqlite';
const dbPath = path.join(__dirname, DB_FILE);

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Failed to connect to SQLite', err);
  } else {
    console.log('Connected to SQLite at', dbPath);
  }
});

module.exports = db;
