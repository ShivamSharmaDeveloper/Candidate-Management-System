/**
 * Prisma Database Client Singleton
 * Ensures a single PrismaClient instance throughout the app
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

module.exports = prisma;
