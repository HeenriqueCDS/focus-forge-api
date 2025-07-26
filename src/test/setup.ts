import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = process.env['DATABASE_URL'] || 'postgresql://test:test@localhost:5432/focus_forge_test';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-for-testing-purposes-only'; 