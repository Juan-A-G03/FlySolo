import { Router } from 'express';
import { TripController } from '@/controllers/trip.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

// Get all trips (filtered by faction for pilots)
router.get('/', AuthMiddleware.authenticate, TripController.getAllTrips);

// Get available trips for pilots
router.get('/available', AuthMiddleware.authenticate, TripController.getAvailableTrips);

// Get user's trips
router.get('/my-trips', AuthMiddleware.authenticate, TripController.getUserTrips);

// Create a new trip
router.post('/', AuthMiddleware.authenticate, TripController.createTrip);

// Get trip by ID
router.get('/:id', AuthMiddleware.authenticate, TripController.getTripById);

// Assign pilot to trip
router.post('/:id/assign', AuthMiddleware.authenticate, TripController.assignPilot);

// Update trip status
router.patch('/:id/status', AuthMiddleware.authenticate, TripController.updateTripStatus);

export default router;