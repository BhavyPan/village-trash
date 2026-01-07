const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Only try to connect if DATABASE_URL is available and not placeholder
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || databaseUrl.includes('YOUR_SUPABASE_PASSWORD')) {
      console.log('⚠️  DATABASE_URL not configured or using placeholder. Skipping database setup.');
      console.log('✅ Prisma client generated (without database connection)');
      return;
    }
    
    // Test database connection
    const prisma = new PrismaClient();
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
    
    await prisma.$disconnect();
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    // Don't exit in production, let the app continue with fallback
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Continuing with fallback storage...');
      return;
    }
    process.exit(1);
  }
}

// Generate Prisma client
try {
  const { execSync } = require('child_process');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.error('❌ Prisma generation failed:', error);
  process.exit(1);
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
