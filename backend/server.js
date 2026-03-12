/**
 * Server Entry Point
 * Starts the Express server on the configured port
 */

require('dotenv').config();
const app = require('./app');
const prisma = require('./src/config/prisma');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Candidate Management API running on http://localhost:${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ─── Graceful Shutdown ───────────────────────────────────────
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
