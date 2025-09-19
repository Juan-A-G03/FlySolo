import { Request, Response } from 'express';
import { prisma } from '../index';
import { AuthUtils } from '../utils/auth.utils';
import { ResponseUtils } from '../utils/response.utils';
import { FileUtils } from '../utils/file.utils';
import { z } from 'zod';

// Extend Request type for file uploads
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  faction: z.enum(['REBEL', 'IMPERIAL', 'NEUTRAL']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
});

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        return ResponseUtils.conflict(res, 'User with this email already exists');
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(validatedData.password);

      // Create user - set default faction if not provided
      const user = await prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword,
          faction: validatedData.faction || 'NEUTRAL', // Default to NEUTRAL if not provided
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          faction: true,
          isActive: true,
          createdAt: true,
        }
      });

      // Generate token - faction can be null from database
      const token = AuthUtils.generateToken({
        userId: user.id,
        id: user.id, // Added for convenience
        email: user.email,
        role: user.role,
        faction: user.faction, // This can be null
      });

      return ResponseUtils.success(res, {
        user,
        token,
      }, 'User registered successfully', 201);

    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
        return ResponseUtils.validationError(res, messages);
      }
      
      console.error('Registration error:', error);
      return ResponseUtils.error(res, 'Registration failed');
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
        // Make sure to include all fields needed for token generation
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          faction: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user || !user.isActive) {
        return ResponseUtils.unauthorized(res, 'Invalid credentials');
      }

      // Check password
      const isValidPassword = await AuthUtils.comparePassword(
        validatedData.password,
        user.password
      );

      if (!isValidPassword) {
        return ResponseUtils.unauthorized(res, 'Invalid credentials');
      }

      // Generate token - faction can be null from database
      const token = AuthUtils.generateToken({
        userId: user.id,
        id: user.id, // Added for convenience
        email: user.email,
        role: user.role,
        faction: user.faction, // This can be null
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return ResponseUtils.success(res, {
        user: userWithoutPassword,
        token,
      }, 'Login successful');

    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
        return ResponseUtils.validationError(res, messages);
      }
      
      console.error('Login error:', error);
      return ResponseUtils.error(res, 'Login failed');
    }
  }

  /**
   * Logout user (client-side token invalidation)
   */
  static async logout(req: Request, res: Response) {
    // In a more complex implementation, you might maintain a blacklist of tokens
    // For now, we just return success and let the client remove the token
    return ResponseUtils.success(res, null, 'Logged out successfully');
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return ResponseUtils.unauthorized(res);
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          faction: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        return ResponseUtils.notFound(res, 'User');
      }

      return ResponseUtils.success(res, user, 'Profile retrieved successfully');

    } catch (error) {
      console.error('Get profile error:', error);
      return ResponseUtils.error(res, 'Failed to get profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return ResponseUtils.unauthorized(res);
      }

      const validatedData = updateProfileSchema.parse(req.body);

      // Check if email is being changed and if it's already taken
      if (validatedData.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: validatedData.email }
        });

        if (existingUser && existingUser.id !== req.user.userId) {
          return ResponseUtils.conflict(res, 'Email already in use');
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: req.user.userId },
        data: validatedData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          faction: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return ResponseUtils.success(res, updatedUser, 'Profile updated successfully');

    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
        return ResponseUtils.validationError(res, messages);
      }
      
      console.error('Update profile error:', error);
      return ResponseUtils.error(res, 'Failed to update profile');
    }
  }

  /**
   * Upload profile image
   */
  static async uploadProfileImage(req: RequestWithFile, res: Response) {
    try {
      if (!req.user) {
        return ResponseUtils.unauthorized(res);
      }

      if (!req.file) {
        return ResponseUtils.validationError(res, ['No image file provided']);
      }

      // Get current user to check for existing profile image
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { profileImage: true }
      });

      if (!currentUser) {
        return ResponseUtils.notFound(res, 'User');
      }

      // Delete old profile image if exists
      if (currentUser.profileImage) {
        const oldFilename = FileUtils.extractFilename(currentUser.profileImage);
        FileUtils.deleteProfileImage(oldFilename);
      }

      // Update user with new profile image path
      const updatedUser = await prisma.user.update({
        where: { id: req.user.userId },
        data: { 
          profileImage: `/uploads/profiles/${req.file.filename}`
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          faction: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return ResponseUtils.success(res, {
        user: updatedUser,
        imageUrl: FileUtils.getProfileImageUrl(req.file.filename, `${req.protocol}://${req.get('host')}`)
      }, 'Profile image uploaded successfully');

    } catch (error) {
      console.error('Upload profile image error:', error);
      
      // Clean up uploaded file if database update fails
      if (req.file) {
        FileUtils.deleteProfileImage(req.file.filename);
      }
      
      return ResponseUtils.error(res, 'Failed to upload profile image');
    }
  }

  /**
   * Delete profile image
   */
  static async deleteProfileImage(req: Request, res: Response) {
    try {
      if (!req.user) {
        return ResponseUtils.unauthorized(res);
      }

      // Get current user to check for existing profile image
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { profileImage: true }
      });

      if (!currentUser) {
        return ResponseUtils.notFound(res, 'User');
      }

      if (!currentUser.profileImage) {
        return ResponseUtils.error(res, 'No profile image to delete', 400);
      }

      // Delete the file from filesystem
      const filename = FileUtils.extractFilename(currentUser.profileImage);
      FileUtils.deleteProfileImage(filename);

      // Remove profile image path from database
      const updatedUser = await prisma.user.update({
        where: { id: req.user.userId },
        data: { profileImage: null },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          faction: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return ResponseUtils.success(res, updatedUser, 'Profile image deleted successfully');

    } catch (error) {
      console.error('Delete profile image error:', error);
      return ResponseUtils.error(res, 'Failed to delete profile image');
    }
  }
}