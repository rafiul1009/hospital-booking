import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config';
import authRoutes from './routes/auth.routes';
import hospitalRoutes from './routes/hospital.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/hospitals', hospitalRoutes);

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