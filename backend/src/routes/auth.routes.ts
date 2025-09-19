import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { FileUtils } from '@/utils/file.utils';

const router = Router();

// Configure multer for profile image uploads
const uploadProfileImage = FileUtils.getProfileImageUpload();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);
router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);
router.put('/profile', AuthMiddleware.authenticate, AuthController.updateProfile);
router.post('/profile/image', AuthMiddleware.authenticate, uploadProfileImage.single('profileImage'), AuthController.uploadProfileImage);
router.delete('/profile/image', AuthMiddleware.authenticate, AuthController.deleteProfileImage);

export default router;