import { UserRepository, AuthService, UserCredentials, AuthResult } from '@/domain';

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(credentials: UserCredentials): Promise<AuthResult> {
    // Find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user has password (not OAuth only)
    if (!user.password) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.authService.comparePassword(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.authService.generateToken(user);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
    };
  }
} 