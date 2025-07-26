import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { authMiddleware } from '@/shared';
import { AuthService } from '@/domain';

export function createAuthRoutes(
  authController: AuthController,
  authService: AuthService
): Router {
  const router = Router();

  // Public routes
  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  // Protected routes
  router.get('/me', authMiddleware(authService), (req, res) => 
    authController.getCurrentUser(req, res)
  );

  return router;
} 