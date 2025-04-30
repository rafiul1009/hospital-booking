import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, register } from '../auth.controller';

jest.mock('@prisma/client');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

import { mockFindUnique, mockCreate } from '../../__mocks__/@prisma/client';


describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return 400 if required fields are missing', async () => {
      await register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Name, email and password are required',
      });
    });

    it('should return 400 if user already exists', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      mockFindUnique.mockResolvedValueOnce({ id: 1 });

      await register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });

    it('should register new user and return 201 with user data', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      mockFindUnique.mockResolvedValueOnce(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const createdUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };
      mockCreate.mockResolvedValue(createdUser);
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      await register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'fake-jwt-token',
        expect.objectContaining({ httpOnly: true })
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      });
    });
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      await login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email and password are required',
      });
    });

    it('should return 401 if user not found', async () => {
      req.body = { email: 'john@example.com', password: 'password' };
      mockFindUnique.mockResolvedValueOnce(null);

      await login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should return 401 if password is invalid', async () => {
      req.body = { email: 'john@example.com', password: 'wrongpassword' };
      mockFindUnique.mockResolvedValueOnce({
        id: 1,
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should return 200 and token if credentials are valid', async () => {
      req.body = { email: 'john@example.com', password: 'password' };
      mockFindUnique.mockResolvedValueOnce({
        id: 1,
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      await login(req as Request, res as Response);
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'fake-jwt-token',
        expect.objectContaining({ httpOnly: true })
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      });
    });
  });
});
