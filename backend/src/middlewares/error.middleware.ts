import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '@/utils/response.utils';
import multer from 'multer';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Multer errors
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return ResponseUtils.error(res, 'File too large. Maximum size is 5MB', 400);
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return ResponseUtils.error(res, 'Too many files. Only 1 file allowed', 400);
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return ResponseUtils.error(res, 'Unexpected file field', 400);
    }
    return ResponseUtils.error(res, `File upload error: ${error.message}`, 400);
  }

  // File validation errors
  if (error.message && error.message.includes('Only image files')) {
    return ResponseUtils.error(res, error.message, 400);
  }

  // Prisma errors
  if (error.code === 'P2002') {
    return ResponseUtils.conflict(res, 'Resource already exists');
  }

  if (error.code === 'P2025') {
    return ResponseUtils.notFound(res, 'Resource');
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return ResponseUtils.validationError(res, messages);
  }

  // Zod validation errors
  if (error.name === 'ZodError') {
    const messages = error.issues.map((issue: any) => 
      `${issue.path.join('.')}: ${issue.message}`
    );
    return ResponseUtils.validationError(res, messages);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return ResponseUtils.unauthorized(res, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return ResponseUtils.unauthorized(res, 'Token expired');
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  return ResponseUtils.error(res, message, statusCode);
};