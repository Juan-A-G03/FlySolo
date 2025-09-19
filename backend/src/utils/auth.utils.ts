import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface JWTPayload {
  userId: string;
  id: string;
  email: string;
  role: string;
  faction: string | null;
  iat?: number;
  exp?: number;
}

export class AuthUtils {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'flysolo-secret-key-2025';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  private static readonly SALT_ROUNDS = 14;
  private static readonly PASSWORD_PEPPER = process.env.PASSWORD_PEPPER || 'flysolo-pepper-2025-change-in-production';

  /**
   * Generate JWT token
   */
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  /**
   * Hash password with pepper and salt
   */
  static async hashPassword(password: string): Promise<string> {
    const pepperedPassword = password + this.PASSWORD_PEPPER;
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(pepperedPassword, salt);
  }

  /**
   * Compare password
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const pepperedPassword = password + this.PASSWORD_PEPPER;
    return bcrypt.compare(pepperedPassword, hashedPassword);
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }

  /**
   * Generate a random string
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}