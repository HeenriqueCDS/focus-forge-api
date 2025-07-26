import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService, User } from '@/domain';
import { env } from '@/shared';

export class JwtAuthService implements AuthService {
  private invalidatedTokens = new Set<string>();

  // Cleanup invalidated tokens every hour
  constructor() {
    setInterval(() => {
      this.invalidatedTokens.clear();
    }, 60 * 60 * 1000); // 1 hour
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
      // Check if token is invalidated
      if (await this.isTokenInvalid(token)) {
        return null;
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async invalidateToken(token: string): Promise<void> {
    this.invalidatedTokens.add(token);
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    return this.invalidatedTokens.has(token);
  }
} 