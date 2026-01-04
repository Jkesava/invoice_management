Invoice Management System
A simple full‑stack Invoice Management System built with React (frontend), Node.js/Express (backend), and SQLite (database). Users can sign up, log in, and manage invoices with full CRUD, plus sorting and filtering by status and date.

This README is written for a project with the structure and code you implemented in this chat (React UI, Express API with /auth and /invoices endpoints, SQLite DB, JWT auth, and basic CSS layout).
​

Tech Stack
Frontend

React 18

React Router v6

Fetch API (or Axios) for HTTP requests

Plain CSS (global.css, auth.css, invoice.css) for styling
​

Backend

Node.js

Express.js

SQLite (via sqlite3)

JSON Web Tokens (JWT) for authentication
​

Tools

npm / Node package scripts

Create React App (or similar) for bootstrapping frontend

Nodemon for backend development (optional)

Features
Authentication
User sign‑up with name, email, and password.

User login with email and password.

Passwords stored as hashed values in SQLite.

JWT‑based session:

Token returned on successful login/sign‑up.

Token sent in Authorization: Bearer <token> header for protected routes.
​

Invoice Management
Create new invoice via “New Invoice” form.

View all invoices on the Home page.

Update existing invoices (edit mode).

Delete invoices from the list.

Fields:

Invoice Number

Client Name

Date

Amount

Status: Paid, Unpaid, Pending

Sorting & Filtering (Bonus)
Filter invoices by status: All, Paid, Unpaid, Pending.

Sort invoices by:

Date

Amount

Invoice Number

Sort order: ascending / descending.
​

Local Storage (Frontend)
Home page keeps a copy of invoices in localStorage.

On load:

Show invoices from localStorage immediately.

Refresh data from backend API and sync localStorage.

UI / UX
Clean, responsive layout with:

Top navigation bar showing app title and logged‑in user.

Dedicated Login and Sign‑Up pages with validation.

Home page invoice table with colored status badges.

Invoice form page for create/edit with clear validation messages.

