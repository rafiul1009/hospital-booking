import { DATABASE_URL } from '.';

// Test database configuration
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || DATABASE_URL.replace('booking_db', 'booking_test_db');

// Test environment settings
export const TEST_CONFIG = {
  // JWT settings for testing
  jwtSecret: 'test-jwt-secret',
  // Test server settings
  port: 4000,
  // Test client URL
  clientUrl: 'http://localhost:3000',
  // Database connection timeout
  dbTimeout: 10000,
};