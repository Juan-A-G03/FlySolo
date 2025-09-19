import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export class ResponseUtils {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }

  /**
   * Send not found response
   */
  static notFound(res: Response, resource: string = 'Resource'): Response {
    return this.error(res, `${resource} not found`, 404);
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send forbidden response
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send validation error response
   */
  static validationError(res: Response, errors: string[]): Response {
    return this.error(res, 'Validation failed', 400, errors.join(', '));
  }

  /**
   * Send conflict response
   */
  static conflict(res: Response, message: string = 'Resource already exists'): Response {
    return this.error(res, message, 409);
  }

  /**
   * Parse pagination parameters from query
   */
  static parsePagination(query: any): { page: number; limit: number; skip: number } {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }
}