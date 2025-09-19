import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { FileUtils } from '@/utils/file.utils';

// Load environment variables
dotenv.config();

// Initialize file directories
FileUtils.initializeDirectories();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Import routes
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import tripRoutes from '@/routes/trip.routes';
import shipRoutes from '@/routes/ship.routes';
import weaponRoutes from '@/routes/weapon.routes';
import pilotRoutes from '@/routes/pilot.routes';
import planetRoutes from '@/routes/planet.routes';

// Import middleware
import { errorHandler } from '@/middlewares/error.middleware';
import { notFound } from '@/middlewares/notFound.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FlySolo API is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ships', shipRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/planets', planetRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FlySolo API running on port ${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/health`);
});