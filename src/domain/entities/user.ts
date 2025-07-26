export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | undefined;
  password?: string | undefined;
  googleId?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  password?: string | undefined;
  googleId?: string | undefined;
  avatarUrl?: string | undefined;
}

export interface UpdateUserData {
  fullName?: string;
  avatarUrl?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  token: string;
} 