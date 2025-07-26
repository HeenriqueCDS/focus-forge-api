import { Request, Response } from 'express';
import { RegisterUserUseCase, LoginUserUseCase, GetCurrentUserUseCase } from '@/application';
import { AuthenticatedRequest } from '@/shared';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, fullName, password } = req.body;

      // Validation
      if (!email || !fullName || !password) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Email, fullName, and password are required',
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid email format',
        });
        return;
      }

      // Password validation
      if (password.length < 6) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Password must be at least 6 characters long',
        });
        return;
      }

      const result = await this.registerUserUseCase.execute({
        email,
        fullName,
        password,
      });

      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User with this email already exists') {
          res.status(409).json({
            error: 'Conflict',
            message: error.message,
          });
          return;
        }
      }

      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to register user',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Email and password are required',
        });
        return;
      }

      const result = await this.loginUserUseCase.execute({
        email,
        password,
      });

      res.status(200).json({
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid email or password') {
          res.status(401).json({
            error: 'Unauthorized',
            message: error.message,
          });
          return;
        }
      }

      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to login',
      });
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
        return;
      }

      const user = await this.getCurrentUserUseCase.execute(req.user.userId);

      res.status(200).json({
        message: 'Current user retrieved successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({
            error: 'Not Found',
            message: error.message,
          });
          return;
        }
      }

      console.error('Get current user error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get current user',
      });
    }
  }
} 