import { 
  Trip, 
  Planet, 
  Ship, 
  PilotShip,
  Review,
  ApiResponse,
  PaginatedResponse,
  TripStatus
} from '../types';
import { apiService } from './api.service';

class TripService {
  // Get all trips with optional filtering
  async getTrips(params?: {
    status?: TripStatus;
    userId?: number;
    pilotId?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Trip>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    const endpoint = query ? `/trips?${query}` : '/trips';
    
    const response = await apiService.get<ApiResponse<PaginatedResponse<Trip>>>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch trips');
  }

  // Get a specific trip by ID
  async getTrip(id: number): Promise<Trip> {
    const response = await apiService.get<ApiResponse<Trip>>(`/trips/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Trip not found');
  }

  // Create a new trip
  async createTrip(tripData: {
    fromPlanetId: number;
    toPlanetId: number;
    shipId: number;
    pilotId: number;
    startDate: string;
    endDate: string;
  }): Promise<Trip> {
    const response = await apiService.post<ApiResponse<Trip>>('/trips', tripData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create trip');
  }

  // Update trip status
  async updateTripStatus(id: number, status: TripStatus): Promise<Trip> {
    const response = await apiService.put<ApiResponse<Trip>>(`/trips/${id}/status`, { status });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update trip status');
  }

  // Cancel a trip
  async cancelTrip(id: number): Promise<Trip> {
    return this.updateTripStatus(id, TripStatus.CANCELLED);
  }

  // Get user's trips
  async getUserTrips(userId?: number): Promise<Trip[]> {
    const endpoint = userId ? `/trips?userId=${userId}` : '/trips/my';
    const response = await apiService.get<ApiResponse<PaginatedResponse<Trip>>>(endpoint);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.message || 'Failed to fetch user trips');
  }

  // Get pilot's trips
  async getPilotTrips(pilotId?: number): Promise<Trip[]> {
    const endpoint = pilotId ? `/trips?pilotId=${pilotId}` : '/trips/pilot';
    const response = await apiService.get<ApiResponse<PaginatedResponse<Trip>>>(endpoint);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.message || 'Failed to fetch pilot trips');
  }

  // Add review to a trip
  async addReview(tripId: number, reviewData: {
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const response = await apiService.post<ApiResponse<Review>>(
      `/trips/${tripId}/reviews`, 
      reviewData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add review');
  }
}

class PlanetService {
  async getPlanets(): Promise<Planet[]> {
    const response = await apiService.get<ApiResponse<Planet[]>>('/planets');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch planets');
  }

  async getPlanet(id: number): Promise<Planet> {
    const response = await apiService.get<ApiResponse<Planet>>(`/planets/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Planet not found');
  }
}

class ShipService {
  async getShips(): Promise<Ship[]> {
    const response = await apiService.get<ApiResponse<Ship[]>>('/ships');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch ships');
  }

  async getShip(id: number): Promise<Ship> {
    const response = await apiService.get<ApiResponse<Ship>>(`/ships/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Ship not found');
  }

  async getAvailableShips(params?: {
    startDate: string;
    endDate: string;
    fromPlanetId: number;
    toPlanetId: number;
  }): Promise<PilotShip[]> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    const endpoint = query ? `/ships/available?${query}` : '/ships/available';
    
    const response = await apiService.get<ApiResponse<PilotShip[]>>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch available ships');
  }
}

export const tripService = new TripService();
export const planetService = new PlanetService();
export const shipService = new ShipService();