import app from './app.js';
import { env } from './config/env.js';
import { checkDbConnection, isNeonDatabase } from './config/db.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, async () => {
  const dbLabel = isNeonDatabase ? 'NeonDB Serverless' : 'PostgreSQL';

  console.log('\n==================================================');
  console.log('  🏭 TRACECORE TRACEABILITY – BACKEND API SERVER');
  console.log('==================================================');
  console.log(`✓ Server running at: http://localhost:${PORT}`);
  console.log(`✓ Environment:       ${env.NODE_ENV}`);
  console.log(`✓ Database Engine:   ${dbLabel}`);
  console.log(`✓ Health Endpoint:   http://localhost:${PORT}/api/health`);
  console.log(`✓ Traceability API:  http://localhost:${PORT}/api/traceability/:serialNumber`);
  console.log(`✓ AI Summary API:    http://localhost:${PORT}/api/ai/traceability-summary`);

  // Check database connection on startup
  const dbHealth = await checkDbConnection();
  if (dbHealth.connected) {
    console.log(`✓ ${dbLabel}: CONNECTED (${dbHealth.version?.split(' ')?.[0] || 'OK'})`);
  } else {
    console.warn(`! ${dbLabel}: NOT CONNECTED (${dbHealth.error || 'Connection pending'})`);
    console.warn('  To initialize your NeonDB database, run: npm run db:setup');
    console.warn('  (Serving verified offline seed data for uninterrupted development & testing)');
  }
  console.log('==================================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default server;
