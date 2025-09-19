import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

export class ResponseUtils {
  /**
   * Success response
   */
  static success<T>(
    res: Response,
    data?: T,
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
   * Error response
   */
  static error(
    res: Response,
    message: string = 'Internal server error',
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response
   */
  static validationError(res: Response, errors: string[]): Response {
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    };
    return res.status(400).json(response);
  }

  /**
   * Not found response
   */
  static notFound(res: Response, resource: string = 'Resource'): Response {
    const response: ApiResponse = {
      success: false,
      message: `${resource} not found`,
      timestamp: new Date().toISOString(),
    };
    return res.status(404).json(response);
  }

  /**
   * Unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    const response: ApiResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
    return res.status(401).json(response);
  }

  /**
   * Forbidden response
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    const response: ApiResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
    return res.status(403).json(response);
  }

  /**
   * Conflict response
   */
  static conflict(res: Response, message: string = 'Conflict'): Response {
    const response: ApiResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
    return res.status(409).json(response);
  }
}