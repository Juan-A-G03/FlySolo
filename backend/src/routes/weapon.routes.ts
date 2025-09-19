import { Router } from 'express';
import { ResponseUtils } from '@/utils/response.utils';

const router = Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  ResponseUtils.success(res, [], 'Weapon routes - Coming soon');
});

export default router;