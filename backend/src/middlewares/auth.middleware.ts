import { Request, Response, NextFunction } from 'express';
import { AuthUtils, JWTPayload } from '@/utils/auth.utils';
import { ResponseUtils } from '@/utils/response.utils';
import { UserRole } from '@/entities';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  /**
   * Verify JWT token and attach user to request
   */
  static authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);

      if (!token) {
        return ResponseUtils.unauthorized(res, 'No token provided');
      }

      const decoded = AuthUtils.verifyToken(token);
      req.user = decoded;
      
      next();
    } catch (error) {
      return ResponseUtils.unauthorized(res, 'Invalid or expired token');
    }
  };

  /**
   * Check if user has required role
   */
  static authorize = (requiredRole: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return ResponseUtils.unauthorized(res, 'Authentication required');
      }

      if (!AuthUtils.hasRole(req.user.role, requiredRole)) {
        return ResponseUtils.forbidden(res, 'Insufficient permissions');
      }

      next();
    };
  };

  /**
   * Check if user has any of the required roles
   */
  static authorizeAny = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return ResponseUtils.unauthorized(res, 'Authentication required');
      }

      if (!AuthUtils.hasAnyRole(req.user.role, requiredRoles)) {
        return ResponseUtils.forbidden(res, 'Insufficient permissions');
      }

      next();
    };
  };

  /**
   * Optional authentication - attach user if token exists but don't require it
   */
  static optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);

      if (token) {
        const decoded = AuthUtils.verifyToken(token);
        req.user = decoded;
      }
    } catch (error) {
      // Token is invalid, but we continue without user
    }

    next();
  };

  /**
   * Check if user is accessing their own resource
   */
  static isOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseUtils.unauthorized(res, 'Authentication required');
    }

    const resourceUserId = req.params.id || req.params.userId;
    const isOwner = req.user.userId === resourceUserId;
    const isAdmin = req.user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return ResponseUtils.forbidden(res, 'You can only access your own resources');
    }

    next();
  };
}