// Enums as string literal types (since SQLite doesn't support native enums)

export enum UserRole {
  USER = 'USER',
  PILOT = 'PILOT',
  ADMIN = 'ADMIN'
}

export enum PilotApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PilotShipStatus {
  ACTIVE = 'ACTIVE',
  PENDING_MODIFICATION = 'PENDING_MODIFICATION',
  PENDING_CHANGE = 'PENDING_CHANGE'
}

export enum TripType {
  PASSENGER = 'PASSENGER',
  CARGO = 'CARGO'
}

export enum TripStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Type definitions for API responses
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  id: string;
  passengerId: string;
  pilotId?: string;
  originPlanetId: string;
  destinationPlanetId: string;
  tripType: TripType;
  passengerCount?: number;
  cargoWeight?: number;
  cargoDescription?: string;
  calculatedDistance: number;
  estimatedDuration: number;
  price: number;
  status: TripStatus;
  requestDate: Date;
  assignedDate?: Date;
  startDate?: Date;
  completedDate?: Date;
}

export interface Planet {
  id: string;
  name: string;
  solarSystemId: string;
  coordinateX: number;
  coordinateY: number;
  coordinateZ: number;
}

export interface SolarSystem {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  centerZ: number;
}

export interface Ship {
  id: string;
  name: string;
  model: string;
  registration: string;
  passengerCapacity: number;
  cargoCapacity: number;
  canHyperspaceTravel: boolean;
  isActive: boolean;
  createdBy: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  damage: number;
  description?: string;
  isActive: boolean;
  createdBy: string;
}