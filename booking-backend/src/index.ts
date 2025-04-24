import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes

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