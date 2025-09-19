import { Request, Response } from 'express';
import { ResponseUtils } from '@/utils/response.utils';

export const notFound = (req: Request, res: Response) => {
  ResponseUtils.notFound(res, `Route ${req.originalUrl}`);
};