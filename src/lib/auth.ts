import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTPayload, AuthUser } from '@/types/auth';
import { UserService } from './services/user.service';
import { AUTH, ERROR_MESSAGES } from './constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  // Generate JWT token
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, AUTH.BCRYPT_ROUNDS);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Login user
  static async login(email: string, password: string) {
    // Find user by email
    const user = await UserService.getByEmail(email, true);
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.password!);
    
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data (without password) and token
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
    };

    return {
      user: authUser,
      token,
      expiresIn: JWT_EXPIRES_IN,
    };
  }

  // Register user
  static async register(data: {
    name: string;
    email: string;
    password: string;
    age?: number;
  }) {
    // Check if email already exists
    const existingUser = await UserService.getByEmail(data.email);
    
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Create user
    const user = await UserService.create(data);

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data and token
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
    };

    return {
      user: authUser,
      token,
      expiresIn: JWT_EXPIRES_IN,
    };
  }

  // Get current user from token
  static async getCurrentUser(token: string): Promise<AuthUser | null> {
    const payload = this.verifyToken(token);
    
    if (!payload) {
      return null;
    }

    const user = await UserService.getById(payload.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
    };
  }

  // Refresh token
  static async refreshToken(token: string) {
    const payload = this.verifyToken(token);
    
    if (!payload) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const user = await UserService.getById(payload.userId);
    
    if (!user || !user.isActive) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Generate new token
    const newToken = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: newToken,
      expiresIn: JWT_EXPIRES_IN,
    };
  }
}

// Middleware helper functions
export function extractTokenFromHeader(authHeader: string | null | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

export function extractTokenFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) {
    return null;
  }

  const tokenCookie = cookieHeader
    .split(';')
    .find(cookie => cookie.trim().startsWith(`${AUTH.TOKEN_KEY}=`));

  if (!tokenCookie) {
    return null;
  }

  return tokenCookie.split('=')[1];
}
