import { Request, Response, NextFunction } from 'express';
import { AuthUtils, JWTPayload } from '../utils/auth.utils';
import { ResponseUtils } from '../utils/response.utils';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  /**
   * Authenticate user using JWT token
   */
  static authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = AuthUtils.extractTokenFromHeader(authHeader);

      if (!token) {
        return ResponseUtils.unauthorized(res, 'Access token is required');
      }

      const decoded = AuthUtils.verifyToken(token);
      if (!decoded) {
        return ResponseUtils.unauthorized(res, 'Invalid or expired token');
      }

      // Add user information to request object
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return ResponseUtils.unauthorized(res, 'Authentication failed');
    }
  }

  /**
   * Authorize user based on roles
   */
  static authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return ResponseUtils.unauthorized(res, 'Authentication required');
        }

        if (!roles.includes(req.user.role)) {
          return ResponseUtils.forbidden(res, 'Insufficient permissions');
        }

        next();
      } catch (error) {
        console.error('Authorization error:', error);
        return ResponseUtils.forbidden(res, 'Authorization failed');
      }
    };
  }

  /**
   * Authorize user based on faction
   */
  static authorizeFaction(factions: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return ResponseUtils.unauthorized(res, 'Authentication required');
        }

        // Allow if user has no faction (neutral) or if faction matches
        if (!req.user.faction || factions.includes(req.user.faction)) {
          return next();
        }

        return ResponseUtils.forbidden(res, 'Faction access denied');
      } catch (error) {
        console.error('Faction authorization error:', error);
        return ResponseUtils.forbidden(res, 'Faction authorization failed');
      }
    };
  }

  /**
   * Authorize admin users only
   */
  static adminOnly = AuthMiddleware.authorize(['ADMIN']);

  /**
   * Authorize pilot users only
   */
  static pilotOnly = AuthMiddleware.authorize(['PILOT']);

  /**
   * Authorize pilot and admin users
   */
  static pilotOrAdmin = AuthMiddleware.authorize(['PILOT', 'ADMIN']);
}