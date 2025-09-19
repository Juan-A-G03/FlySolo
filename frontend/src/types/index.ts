// User and Authentication Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  faction?: 'REBEL' | 'IMPERIAL' | 'NEUTRAL';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  PILOT = 'PILOT',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  faction?: 'REBEL' | 'IMPERIAL' | 'NEUTRAL';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Planet and Location Types
export interface SolarSystem {
  id: number;
  name: string;
  description: string;
  planets: Planet[];
}

export interface Planet {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  dangerLevel: number;
  solarSystemId: number;
  solarSystem?: SolarSystem;
  tripsFrom?: Trip[];
  tripsTo?: Trip[];
}

// Ship and Weapon Types
export interface Ship {
  id: number;
  name: string;
  description: string;
  capacity: number;
  pricePerDay: number;
  imageUrl?: string;
  pilotShips?: PilotShip[];
  trips?: Trip[];
}

export interface Weapon {
  id: number;
  name: string;
  description: string;
  damage: number;
  range: number;
  price: number;
  imageUrl?: string;
}

export interface PilotShip {
  id: number;
  pilotId: number;
  shipId: number;
  pilot: User;
  ship: Ship;
  weapons: Weapon[];
}

// Trip Types
export interface Trip {
  id: number;
  fromPlanetId: number;
  toPlanetId: number;
  shipId: number;
  pilotId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: TripStatus;
  fromPlanet: Planet;
  toPlanet: Planet;
  ship: Ship;
  pilot: User;
  user: User;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export enum TripStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Review {
  id: number;
  tripId: number;
  rating: number;
  comment?: string;
  trip: Trip;
  createdAt: string;
  updatedAt: string;
}

// Form and UI Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file';
  value: string | number | File | null;
  required?: boolean;
  error?: string;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string | number;
  label: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  roles?: UserRole[];
  children?: NavItem[];
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  status?: number;
}