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

// Root landing page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FOOD COURT — Backend API Server</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f7f3ee;
      color: #26140b;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #ffffff;
      max-width: 620px;
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 16px 40px rgba(38, 20, 11, 0.08);
      border: 1px solid #e8dec8;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #26140b 0%, #3e2213 100%);
      color: #ffffff;
      padding: 36px 32px;
      text-align: center;
      border-bottom: 3px solid #c9933b;
    }
    .badge {
      display: inline-block;
      background: rgba(46, 125, 50, 0.2);
      border: 1px solid #4caf50;
      color: #81c784;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    p.sub {
      color: #d4b896;
      font-size: 14px;
    }
    .content {
      padding: 32px;
    }
    .cta-box {
      background: #fdfaf5;
      border: 2px dashed #c9933b;
      border-radius: 14px;
      padding: 24px;
      text-align: center;
      margin-bottom: 28px;
    }
    .cta-box h3 {
      font-size: 17px;
      color: #26140b;
      margin-bottom: 8px;
    }
    .cta-box p {
      font-size: 13px;
      color: #6d5b52;
      margin-bottom: 18px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #c9933b 0%, #aa7728 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(201, 147, 59, 0.35);
      transition: transform 0.15s ease;
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .endpoints {
      margin-top: 10px;
    }
    .endpoints h4 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8c7667;
      margin-bottom: 12px;
    }
    .endpoint-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .endpoint-list li a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f7f3ee;
      padding: 10px 14px;
      border-radius: 8px;
      text-decoration: none;
      color: #26140b;
      font-family: monospace;
      font-size: 13px;
      border: 1px solid #ebdcc5;
      transition: background 0.15s;
    }
    .endpoint-list li a:hover {
      background: #efe4d2;
    }
    .method {
      background: #2e7d32;
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: sans-serif;
    }
    .footer {
      background: #fdfaf5;
      padding: 16px 32px;
      border-top: 1px solid #eee5d8;
      text-align: center;
      font-size: 12px;
      color: #8c7667;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">● Server Active & Online</div>
      <h1>FOOD COURT RESTAURANT API</h1>
      <p class="sub">Express REST Backend Server (Port 5000)</p>
    </div>
    <div class="content">
      <div class="cta-box">
        <h3>Looking for the Restaurant Website?</h3>
        <p>The interactive frontend application with Login, Menus, Reviews & Tables runs on port <strong>4200</strong>.</p>
        <a class="btn" href="http://localhost:4200" target="_blank">👉 Open Restaurant Website (Port 4200)</a>
      </div>

      <div class="endpoints">
        <h4>Available REST API Endpoints:</h4>
        <ul class="endpoint-list">
          <li><a href="/api/health" target="_blank"><span>/api/health</span> <span class="method">GET</span></a></li>
          <li><a href="/api/tables" target="_blank"><span>/api/tables</span> <span class="method">GET</span></a></li>
          <li><a href="/api/reservations" target="_blank"><span>/api/reservations</span> <span class="method">GET</span></a></li>
          <li><a href="/api/waitlist" target="_blank"><span>/api/waitlist</span> <span class="method">GET</span></a></li>
          <li><a href="/api/analytics" target="_blank"><span>/api/analytics</span> <span class="method">GET</span></a></li>
        </ul>
      </div>
    </div>
    <div class="footer">
      FOOD COURT Luxury Dining System &bull; Angular 18+ & Node.js Express
    </div>
  </div>
</body>
</html>
  `);
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

