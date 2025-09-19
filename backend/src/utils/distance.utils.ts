export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export interface Planet extends Coordinates {
  id: string;
  name: string;
  solarSystemId: string;
}

export interface SolarSystem extends Coordinates {
  id: string;
  name: string;
}

export interface PlanetWithSystem extends Planet {
  solarSystem: SolarSystem;
}

export class DistanceUtils {
  /**
   * Calculate Euclidean distance between two 3D points
   */
  static euclideanDistance(point1: Coordinates, point2: Coordinates): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    const dz = point1.z - point2.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Calculate travel distance between two planets
   * If planets are in the same solar system, calculate direct distance
   * If in different systems, calculate: planet -> system center -> other system center -> planet
   */
  static calculateTripDistance(
    originPlanet: PlanetWithSystem,
    destinationPlanet: PlanetWithSystem
  ): number {
    // Same solar system - direct distance between planets
    if (originPlanet.solarSystemId === destinationPlanet.solarSystemId) {
      return this.euclideanDistance(
        { x: originPlanet.x, y: originPlanet.y, z: originPlanet.z },
        { x: destinationPlanet.x, y: destinationPlanet.y, z: destinationPlanet.z }
      );
    }

    // Different solar systems - calculate via system centers
    const distanceToOriginCenter = this.euclideanDistance(
      { x: originPlanet.x, y: originPlanet.y, z: originPlanet.z },
      { x: originPlanet.solarSystem.x, y: originPlanet.solarSystem.y, z: originPlanet.solarSystem.z }
    );

    const distanceBetweenSystems = this.euclideanDistance(
      { x: originPlanet.solarSystem.x, y: originPlanet.solarSystem.y, z: originPlanet.solarSystem.z },
      { x: destinationPlanet.solarSystem.x, y: destinationPlanet.solarSystem.y, z: destinationPlanet.solarSystem.z }
    );

    const distanceFromDestinationCenter = this.euclideanDistance(
      { x: destinationPlanet.solarSystem.x, y: destinationPlanet.solarSystem.y, z: destinationPlanet.solarSystem.z },
      { x: destinationPlanet.x, y: destinationPlanet.y, z: destinationPlanet.z }
    );

    return distanceToOriginCenter + distanceBetweenSystems + distanceFromDestinationCenter;
  }

  /**
   * Estimate travel duration based on distance
   * @param distance - Distance in space units
   * @param hasHyperdrive - Whether ship can travel through hyperspace
   * @returns Duration in minutes
   */
  static estimateTravelDuration(distance: number, hasHyperdrive: boolean = true): number {
    // Base speed: 1 unit per minute for regular travel
    // Hyperspace speed: 10x faster for long distances
    const baseSpeed = 1; // units per minute
    const hyperSpeedMultiplier = 10;

    if (hasHyperdrive && distance > 50) {
      // Use hyperspace for long distances
      const hyperSpaceDistance = Math.max(0, distance - 50);
      const regularDistance = Math.min(distance, 50);
      
      return regularDistance / baseSpeed + hyperSpaceDistance / (baseSpeed * hyperSpeedMultiplier);
    }

    return distance / baseSpeed;
  }

  /**
   * Calculate trip price based on distance, type, and other factors
   */
  static calculateTripPrice(
    distance: number,
    tripType: 'PASSENGER' | 'CARGO',
    passengerCount?: number,
    cargoWeight?: number
  ): number {
    const baseRate = 10; // credits per unit distance
    let price = distance * baseRate;

    if (tripType === 'PASSENGER') {
      const passengers = passengerCount || 1;
      price *= passengers;
      
      // Passenger comfort premium
      price *= 1.5;
    } else if (tripType === 'CARGO') {
      const weight = cargoWeight || 1;
      
      // Cargo rate per ton
      price *= weight * 0.8;
      
      // Hazardous cargo premium (could be extended)
      if (weight > 100) {
        price *= 1.3; // Heavy cargo premium
      }
    }

    // Minimum price
    return Math.max(price, 50);
  }
}