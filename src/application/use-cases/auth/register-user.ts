import { UserRepository, AuthService, CreateUserData, AuthResult } from '@/domain';

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(data: CreateUserData): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await this.authService.hashPassword(data.password);
    }

    // Create user
    const userData = {
      ...data,
      password: hashedPassword,
    };
    const user = await this.userRepository.create(userData);

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