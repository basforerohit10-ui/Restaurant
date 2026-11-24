import express from 'express';
import cors from 'cors';
import { db } from './data/database.js';
import tablesRouter from './routes/tables.js';
import reservationsRouter from './routes/reservations.js';
import waitlistRouter from './routes/waitlist.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Food Court Restaurant Management API',
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/tables', tablesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/waitlist', waitlistRouter);
app.use('/api/analytics', analyticsRouter);

// Reset database endpoint
app.post('/api/reset', async (req, res) => {
  try {
    const data = await db.reset();
    res.json({ success: true, message: 'Database reset to initial demo seeds', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
async function startServer() {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🍽️  AuraBistro Backend API Server`);
      console.log(`  🚀  Listening at: http://localhost:${PORT}`);
      console.log(`  📊  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start AuraBistro server:', err);
    process.exit(1);
  }
}

startServer();

