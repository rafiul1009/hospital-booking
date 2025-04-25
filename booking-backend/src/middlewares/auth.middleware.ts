import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {    
    const token = req.cookies.token;    
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      name: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};