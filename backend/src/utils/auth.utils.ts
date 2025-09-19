import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/entities';

export interface JWTPayload {
  userId: string;
  id: string; // Added for convenience (same as userId)
  email: string;
  role: UserRole;
  faction?: string; // Added for faction system
  iat?: number;
  exp?: number;
}

export class AuthUtils {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  private static readonly SALT_ROUNDS = 14; // Increased for better security
  private static readonly PEPPER = process.env.PASSWORD_PEPPER || 'flysolo-pepper-2025'; // Additional security layer

  /**
   * Hash a password using bcrypt with salt and pepper
   */
  static async hashPassword(password: string): Promise<string> {
    // Add pepper to password before hashing
    const pepperedPassword = password + this.PEPPER;
    return bcrypt.hash(pepperedPassword, this.SALT_ROUNDS);
  }

  /**
   * Compare a password with its hash (including pepper)
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    // Add pepper to password before comparing
    const pepperedPassword = password + this.PEPPER;
    return bcrypt.compare(pepperedPassword, hash);
  }

  /**
   * Generate a JWT token
   */
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authorization?: string): string | null {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return null;
    }
    return authorization.substring(7);
  }

  /**
   * Check if user has required role
   */
  static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.USER]: 0,
      [UserRole.PILOT]: 1,
      [UserRole.ADMIN]: 2,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * Check if user has any of the required roles
   */
  static hasAnyRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.some(role => this.hasRole(userRole, role));
  }
}