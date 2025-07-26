import { AuthService } from '@/domain';

export interface LogoutUserUseCase {
  execute(token: string): Promise<void>;
}

export class LogoutUserUseCaseImpl implements LogoutUserUseCase {
  constructor(private authService: AuthService) {}

  async execute(token: string): Promise<void> {
    // Verify the token first
    const decoded = await this.authService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    // Invalidate the token
    await this.authService.invalidateToken(token);
  }
} 