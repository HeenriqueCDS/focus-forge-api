import { User } from '../entities/user';

export interface AuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(user: User): string;
  verifyToken(token: string): { userId: string; email: string } | null;
} 