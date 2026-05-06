require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes      = require('./src/routes/auth');
const leadRoutes      = require('./src/routes/leads');
const noteRoutes      = require('./src/routes/notes');
const dashboardRoutes = require('./src/routes/dashboard');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/leads',     leadRoutes);
app.use('/api/notes',     noteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`CRM backend running on http://localhost:${PORT}`);
});
