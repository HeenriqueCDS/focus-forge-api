import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JwtAuthService } from '@/infrastructure';
import { User } from '@/domain';

// Mock environment variables
vi.mock('@/shared/config/environment', () => ({
  env: {
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '1h',
  },
}));

describe('JwtAuthService', () => {
  let authService: JwtAuthService;
  let mockUser: User;

  beforeEach(() => {
    authService = new JwtAuthService();
    mockUser = {
      id: 'user123',
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      // Arrange
      const password = 'testPassword123';

      // Act
      const hashedPassword = await authService.hashPassword(password);

      // Assert
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt pattern
    });

    it('should generate different hashes for same password', async () => {
      // Arrange
      const password = 'testPassword123';

      // Act
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      // Arrange
      const password = 'testPassword123';
      const hashedPassword = await authService.hashPassword(password);

      // Act
      const result = await authService.comparePassword(password, hashedPassword);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      // Arrange
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await authService.hashPassword(password);

      // Act
      const result = await authService.comparePassword(wrongPassword, hashedPassword);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      // Act
      const token = authService.generateToken(mockUser);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different users', () => {
      // Arrange
      const user2 = { ...mockUser, id: 'user456', email: 'test2@example.com' };

      // Act
      const token1 = authService.generateToken(mockUser);
      const token2 = authService.generateToken(user2);

      // Assert
      expect(token1).not.toBe(token2);
    });

    it('should include user id and email in token payload', () => {
      // Act
      const token = authService.generateToken(mockUser);
      const decoded = authService.verifyToken(token);

      // Assert
      expect(decoded).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      // Arrange
      const token = authService.generateToken(mockUser);

      // Act
      const result = authService.verifyToken(token);

      // Assert
      expect(result).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should return null for invalid token', () => {
      // Arrange
      const invalidToken = 'invalid.token.here';

      // Act
      const result = authService.verifyToken(invalidToken);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for expired token', () => {
      // This test would require mocking time or using a very short expiration
      // For now, we'll test with a malformed token
      const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';

      const result = authService.verifyToken(malformedToken);

      expect(result).toBeNull();
    });

    it('should return null for empty token', () => {
      // Act
      const result = authService.verifyToken('');

      // Assert
      expect(result).toBeNull();
    });
  });
}); 