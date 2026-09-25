import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { checkDbConnection } from './config/db.js';

// Middlewares
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

// Routes
import traceabilityRoutes from './routes/traceabilityRoutes.js';
import productRoutes from './routes/productRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        env.FRONTEND_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
      ];

      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/hackathon demo
    },
    credentials: true,
  })
);

// 3. Request Body Parsing with strict size limits
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 4. Rate Limiting on API surface
app.use('/api', apiLimiter);

// 5. Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'TraceCore Traceability API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      traceability: '/api/traceability/:serialNumber',
      dashboardStats: '/api/products/stats/dashboard',
      aiSummary: '/api/ai/traceability-summary',
    },
  });
});

app.get('/api/health', async (req, res) => {
  const dbHealth = await checkDbConnection();

  res.status(200).json({
    status: 'OK',
    database: dbHealth.connected ? 'connected' : 'disconnected',
    databaseProvider: dbHealth.provider || 'NeonDB Serverless',
    ...(dbHealth.error ? { databaseError: dbHealth.error } : {}),
  });
});

// 6. Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/traceability', traceabilityRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);

// 7. 404 Handler for undefined routes
app.use(notFoundHandler);

// 8. Global Error Handler
app.use(errorHandler);

export default app;
