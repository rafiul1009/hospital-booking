import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CLIENT_URL, PORT } from './config';
import authRoutes from './routes/auth.routes';
import hospitalRoutes from './routes/hospital.routes';
import bookingRoutes from './routes/booking.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// CORS configuration
app.use(cors({
  origin: CLIENT_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/bookings', bookingRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 404 not found handler
app.use(notFoundHandler);

// Common error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});