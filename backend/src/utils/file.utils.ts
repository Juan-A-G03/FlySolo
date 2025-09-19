import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export class FileUtils {
  private static readonly UPLOAD_DIR = 'uploads';
  private static readonly PROFILE_IMAGES_DIR = path.join(FileUtils.UPLOAD_DIR, 'profiles');
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

  /**
   * Initialize upload directories
   */
  static initializeDirectories(): void {
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.PROFILE_IMAGES_DIR)) {
      fs.mkdirSync(this.PROFILE_IMAGES_DIR, { recursive: true });
    }
  }

  /**
   * Configure multer for profile image uploads
   */
  static getProfileImageUpload() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.PROFILE_IMAGES_DIR);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (this.ALLOWED_EXTENSIONS.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: this.MAX_FILE_SIZE,
        files: 1
      }
    });
  }

  /**
   * Delete a file if it exists
   */
  static deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Delete profile image
   */
  static deleteProfileImage(filename: string): boolean {
    const fullPath = path.join(this.PROFILE_IMAGES_DIR, filename);
    return this.deleteFile(fullPath);
  }

  /**
   * Get profile image URL
   */
  static getProfileImageUrl(filename: string, baseUrl: string): string {
    return `${baseUrl}/uploads/profiles/${filename}`;
  }

  /**
   * Extract filename from profile image path/URL
   */
  static extractFilename(imagePath: string): string {
    return path.basename(imagePath);
  }

  /**
   * Validate file size
   */
  static validateFileSize(file: Express.Multer.File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  /**
   * Validate file extension
   */
  static validateFileExtension(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return this.ALLOWED_EXTENSIONS.includes(ext);
  }

  /**
   * Generate unique filename while preserving extension
   */
  static generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    return `${uuidv4()}${ext}`;
  }
}