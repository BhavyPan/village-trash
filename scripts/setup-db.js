const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Push schema to database
    const { execSync } = require('child_process');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✅ Database schema pushed');
    
    // Generate Prisma client
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
