const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDb } = require('./models/initDb');
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

initDb();

app.use('/auth', authRoutes);
app.use('/invoices', authMiddleware, invoiceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Invoice API running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

