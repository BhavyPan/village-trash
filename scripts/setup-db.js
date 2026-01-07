const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Push schema to database (skip for production to avoid data loss)
    if (process.env.NODE_ENV !== 'production') {
      const { execSync } = require('child_process');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('✅ Database schema pushed');
    } else {
      console.log('⏭️  Skipping schema push in production');
    }
    
    // Generate Prisma client
    const { execSync } = require('child_process');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    // Don't exit in production, let the app continue with fallback
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Continuing with fallback storage...');
      return;
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
