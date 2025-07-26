import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository, JwtAuthService, AuthController, createAuthRoutes } from '@/infrastructure';
import { RegisterUserUseCase, LoginUserUseCase, GetCurrentUserUseCase } from '@/application';

export class Container {
  private static instance: Container;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repositories
  getUserRepository(): PrismaUserRepository {
    return new PrismaUserRepository(this.prisma);
  }

  // Services
  getAuthService(): JwtAuthService {
    return new JwtAuthService();
  }

  // Use Cases
  getRegisterUserUseCase(): RegisterUserUseCase {
    return new RegisterUserUseCase(
      this.getUserRepository(),
      this.getAuthService()
    );
  }

  getLoginUserUseCase(): LoginUserUseCase {
    return new LoginUserUseCase(
      this.getUserRepository(),
      this.getAuthService()
    );
  }

  getGetCurrentUserUseCase(): GetCurrentUserUseCase {
    return new GetCurrentUserUseCase(this.getUserRepository());
  }

  // Controllers
  getAuthController(): AuthController {
    return new AuthController(
      this.getRegisterUserUseCase(),
      this.getLoginUserUseCase(),
      this.getGetCurrentUserUseCase()
    );
  }

  // Routes
  getAuthRoutes() {
    return createAuthRoutes(
      this.getAuthController(),
      this.getAuthService()
    );
  }

  // Database
  getPrisma(): PrismaClient {
    return this.prisma;
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 