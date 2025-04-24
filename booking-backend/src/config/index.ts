import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/booking_db?schema=public';

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set in environment variables. Using fallback secret key.');
}

if (!process.env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL not set in environment variables. Using default connection string.');
}