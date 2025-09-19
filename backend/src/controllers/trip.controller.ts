import { Request, Response } from 'express';
import { prisma } from '../index';
import { ResponseUtils } from '@/utils/response.utils';
import { DistanceUtils } from '@/utils/distance.utils';
import { z } from 'zod';

// Validation schemas
const createTripSchema = z.object({
  originPlanetId: z.string(),
  destinationPlanetId: z.string(),
  tripType: z.enum(['PASSENGER', 'CARGO']),
  passengerCount: z.number().int().positive().optional(),
  cargoWeight: z.number().positive().optional(),
  cargoDescription: z.string().optional(),
  faction: z.enum(['REBEL', 'IMPERIAL']).optional(),
  isCovert: z.boolean().optional(),
});

const updateTripSchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

export class TripController {
  // Get all trips (filtered by faction for pilots)
  static async getAllTrips(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      const userFaction = req.user?.faction;

      let whereClause: any = {};

      // For pilots, filter trips based on their faction
      if (userRole === 'PILOT' && userFaction) {
        whereClause = {
          OR: [
            { faction: userFaction }, // Trips for their faction
            { isCovert: true },       // Covert missions (available to all)
            { faction: null }         // Neutral trips
          ]
        };
      }
      // For regular users, show trips they can book based on their faction
      else if (userRole === 'USER' && userFaction) {
        whereClause = {
          OR: [
            { faction: userFaction }, // Trips for their faction
            { faction: null }         // Neutral trips
          ]
        };
      }

      const trips = await prisma.trip.findMany({
        where: whereClause,
        include: {
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          pilot: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          originPlanet: {
            include: {
              solarSystem: true
            }
          },
          destinationPlanet: {
            include: {
              solarSystem: true
            }
          }
        },
        orderBy: {
          requestDate: 'desc'
        }
      });

      ResponseUtils.success(res, trips, 'Trips retrieved successfully');
    } catch (error) {
      console.error('Error fetching trips:', error);
      ResponseUtils.error(res, 'Failed to fetch trips', 500);
    }
  }

  // Get available trips for pilots (only show unassigned trips)
  static async getAvailableTrips(req: Request, res: Response) {
    try {
      const userFaction = req.user?.faction;

      let whereClause: any = {
        status: 'PENDING',
        pilotId: null
      };

      // Filter by faction for pilots
      if (userFaction) {
        whereClause.OR = [
          { faction: userFaction }, // Trips for their faction
          { isCovert: true },       // Covert missions
          { faction: null }         // Neutral trips
        ];
      }

      const trips = await prisma.trip.findMany({
        where: whereClause,
        include: {
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          originPlanet: {
            include: {
              solarSystem: true
            }
          },
          destinationPlanet: {
            include: {
              solarSystem: true
            }
          }
        },
        orderBy: {
          requestDate: 'desc'
        }
      });

      ResponseUtils.success(res, trips, 'Available trips retrieved successfully');
    } catch (error) {
      console.error('Error fetching available trips:', error);
      ResponseUtils.error(res, 'Failed to fetch available trips', 500);
    }
  }

  // Get user's trips
  static async getUserTrips(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const trips = await prisma.trip.findMany({
        where: {
          OR: [
            { passengerId: userId },
            { pilotId: userId }
          ]
        },
        include: {
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          pilot: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          originPlanet: {
            include: {
              solarSystem: true
            }
          },
          destinationPlanet: {
            include: {
              solarSystem: true
            }
          }
        },
        orderBy: {
          requestDate: 'desc'
        }
      });

      ResponseUtils.success(res, trips, 'User trips retrieved successfully');
    } catch (error) {
      console.error('Error fetching user trips:', error);
      ResponseUtils.error(res, 'Failed to fetch user trips', 500);
    }
  }

  // Create a new trip
  static async createTrip(req: Request, res: Response) {
    try {
      const validation = createTripSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMessages = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return ResponseUtils.validationError(res, errorMessages);
      }

      const {
        originPlanetId,
        destinationPlanetId,
        tripType,
        passengerCount,
        cargoWeight,
        cargoDescription,
        faction,
        isCovert
      } = validation.data;

      const userId = req.user?.id;
      const userFaction = req.user?.faction;

      // Get planets to calculate distance
      const [originPlanet, destinationPlanet] = await Promise.all([
        prisma.planet.findUnique({ where: { id: originPlanetId } }),
        prisma.planet.findUnique({ where: { id: destinationPlanetId } })
      ]);

      if (!originPlanet || !destinationPlanet) {
        return ResponseUtils.error(res, 'Invalid planet IDs', 400);
      }

      // Calculate distance and price
      const distance = DistanceUtils.euclideanDistance(
        { 
          x: originPlanet.coordinateX,
          y: originPlanet.coordinateY,
          z: originPlanet.coordinateZ
        },
        { 
          x: destinationPlanet.coordinateX,
          y: destinationPlanet.coordinateY,
          z: destinationPlanet.coordinateZ
        }
      );

      const estimatedDuration = Math.ceil(distance * 2); // 2 minutes per unit of distance
      const basePrice = distance * 100; // 100 credits per unit of distance
      const price = tripType === 'CARGO' ? basePrice * 1.5 : basePrice;

      // Set faction based on user's faction if not specified
      const tripFaction = faction || userFaction;

      const trip = await prisma.trip.create({
        data: {
          passengerId: userId!,
          originPlanetId,
          destinationPlanetId,
          tripType,
          passengerCount,
          cargoWeight,
          cargoDescription,
          calculatedDistance: distance,
          estimatedDuration,
          price,
          faction: tripFaction,
          isCovert: isCovert || false,
        },
        include: {
          originPlanet: {
            include: {
              solarSystem: true
            }
          },
          destinationPlanet: {
            include: {
              solarSystem: true
            }
          }
        }
      });

      ResponseUtils.success(res, trip, 'Trip created successfully', 201);
    } catch (error) {
      console.error('Error creating trip:', error);
      ResponseUtils.error(res, 'Failed to create trip', 500);
    }
  }

  // Assign pilot to trip
  static async assignPilot(req: Request, res: Response) {
    try {
      const { id: tripId } = req.params;
      const pilotId = req.user?.id;
      const pilotFaction = req.user?.faction;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          passenger: {
            select: { faction: true }
          }
        }
      });

      if (!trip) {
        return ResponseUtils.error(res, 'Trip not found', 404);
      }

      if (trip.pilotId) {
        return ResponseUtils.error(res, 'Trip already assigned to a pilot', 400);
      }

      if (trip.status !== 'PENDING') {
        return ResponseUtils.error(res, 'Trip is not available for assignment', 400);
      }

      // Check faction compatibility
      if (trip.faction && pilotFaction) {
        if (!trip.isCovert && trip.faction !== pilotFaction) {
          return ResponseUtils.error(res, 'You cannot take trips from opposing factions', 403);
        }
      }

      const updatedTrip = await prisma.trip.update({
        where: { id: tripId },
        data: {
          pilotId,
          status: 'ASSIGNED',
          assignedDate: new Date()
        },
        include: {
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          pilot: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          originPlanet: {
            include: {
              solarSystem: true
            }
          },
          destinationPlanet: {
            include: {
              solarSystem: true
            }
          }
        }
      });

      ResponseUtils.success(res, updatedTrip, 'Pilot assigned successfully');
    } catch (error) {
      console.error('Error assigning pilot:', error);
      ResponseUtils.error(res, 'Failed to assign pilot', 500);
    }
  }

  // Update trip status
  static async updateTripStatus(req: Request, res: Response) {
    try {
      const { id: tripId } = req.params;
      const validation = updateTripSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessages = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return ResponseUtils.validationError(res, errorMessages);
      }

      const { status } = validation.data;
      const userId = req.user?.id;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });

      if (!trip) {
        return ResponseUtils.error(res, 'Trip not found', 404);
      }

      // Only pilot or passenger can update trip status
      if (trip.pilotId !== userId && trip.passengerId !== userId) {
        return ResponseUtils.error(res, 'Not authorized to update this trip', 403);
      }

      const updateData: any = { status };

      // Set appropriate timestamps based on status
      if (status === 'IN_PROGRESS') {
        updateData.startDate = new Date();
      } else if (status === 'COMPLETED') {
        updateData.completedDate = new Date();
      }

      const updatedTrip = await prisma.trip.update({
        where: { id: tripId },
        data: updateData,
        include: {
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          pilot: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          originPlanet: {
            include: {
              solarSystem: true
            }
          },
          destinationPlanet: {
            include: {
              solarSystem: true
            }
          }
        }
      });

      ResponseUtils.success(res, updatedTrip, 'Trip status updated successfully');
    } catch (error) {
      console.error('Error updating trip status:', error);
      ResponseUtils.error(res, 'Failed to update trip status', 500);
    }
  }

  // Get trip by ID
  static async getTripById(req: Request, res: Response) {
    try {
      const { id: tripId } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          pilot: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              faction: true,
            }
          },
          originPlanet: {
            include: {
              solarSystem: true
            }
          },
          destinationPlanet: {
            include: {
              solarSystem: true
            }
          },
          review: true
        }
      });

      if (!trip) {
        return ResponseUtils.error(res, 'Trip not found', 404);
      }

      // Check if user has access to this trip
      const hasAccess = userRole === 'ADMIN' || 
                       trip.passengerId === userId || 
                       trip.pilotId === userId;

      if (!hasAccess) {
        return ResponseUtils.error(res, 'Not authorized to view this trip', 403);
      }

      ResponseUtils.success(res, trip, 'Trip retrieved successfully');
    } catch (error) {
      console.error('Error fetching trip:', error);
      ResponseUtils.error(res, 'Failed to fetch trip', 500);
    }
  }
}