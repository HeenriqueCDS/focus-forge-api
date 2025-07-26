import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../../index'; // We'll need to export app from index.ts

const prisma = new PrismaClient();

describe('Auth Routes Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.user).toHaveProperty('fullName', userData.fullName);
      expect(response.body.data.user).not.toHaveProperty('password');

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(user).toBeDefined();
      expect(user?.email).toBe(userData.email);
      expect(user?.fullName).toBe(userData.fullName);
    });

    it('should return 409 when user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        fullName: 'Existing User',
        password: 'password123',
      };

      // Create user first
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Act - Try to register same user again
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);

      // Assert
      expect(response.body).toHaveProperty('error', 'Conflict');
      expect(response.body).toHaveProperty('message', 'User with this email already exists');
    });

    it('should return 400 for invalid email format', async () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        fullName: 'Test User',
        password: 'password123',
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Invalid email format');
    });

    it('should return 400 for short password', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: '123',
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Password must be at least 6 characters long');
    });

    it('should return 400 for missing required fields', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        // missing fullName and password
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Email, fullName, and password are required');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'login@example.com',
          fullName: 'Login User',
          password: 'password123',
        });
    });

    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'login@example.com',
        password: 'password123',
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', credentials.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 401 for invalid email', async () => {
      // Arrange
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401);

      // Assert
      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 for invalid password', async () => {
      // Arrange
      const credentials = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401);

      // Assert
      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 400 for missing credentials', async () => {
      // Arrange
      const credentials = {
        email: 'login@example.com',
        // missing password
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Register and login a user to get token
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'me@example.com',
          fullName: 'Me User',
          password: 'password123',
        });

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'me@example.com',
          password: 'password123',
        });

      authToken = loginResponse.body.data.token;
    });

    it('should return current user with valid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('message', 'Current user retrieved successfully');
      expect(response.body.data).toHaveProperty('email', 'me@example.com');
      expect(response.body.data).toHaveProperty('fullName', 'Me User');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 401 without authorization header', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      // Assert
      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Access token is required');
    });

    it('should return 401 with invalid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      // Assert
      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });

    it('should return 401 with malformed authorization header', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      // Assert
      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Access token is required');
    });
  });
}); 