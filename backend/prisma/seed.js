/**
 * Prisma Database Seed Script
 * Seeds the default admin user into the database
 * Run: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Admin User ─────────────────────────────────────────
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 12);
    await prisma.admin.create({
      data: {
        name: 'Super Admin',
        email: 'admin@example.com',
        passwordHash,
      },
    });
    console.log('✅ Admin user created: admin@example.com / Admin@123');
  } else {
    console.log('ℹ️  Admin user already exists, skipping.');
  }

  // ─── Sample Countries ────────────────────────────────────
  const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
  for (const name of countries) {
    await prisma.country.upsert({
      where: { countryName: name },
      update: {},
      create: { countryName: name, status: 'active' },
    });
  }
  console.log('✅ Sample countries seeded.');

  // ─── Sample Qualifications ───────────────────────────────
  const qualifications = ['B.Tech', 'M.Tech', 'MBA', 'BCA', 'MCA', 'B.Sc', 'M.Sc'];
  for (const name of qualifications) {
    await prisma.qualification.upsert({
      where: { qualName: name },
      update: {},
      create: { qualName: name, status: 'active' },
    });
  }
  console.log('✅ Sample qualifications seeded.');

  // ─── Sample Designations ─────────────────────────────────
  const designations = ['Software Engineer', 'Senior Developer', 'Team Lead', 'Project Manager', 'QA Engineer', 'DevOps Engineer'];
  for (const name of designations) {
    await prisma.designation.upsert({
      where: { desigName: name },
      update: {},
      create: { desigName: name, status: 'active' },
    });
  }
  console.log('✅ Sample designations seeded.');

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
