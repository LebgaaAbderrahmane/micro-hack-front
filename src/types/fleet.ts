export type TruckStatus = "active" | "maintenance" | "idle" | "in_transit";

export interface Truck {
    id: string;
    licensePlate: string;
    model: string;
    year: number;
    status: TruckStatus;
    lastMaintenance: string; // ISO date
    nextMaintenance: string; // ISO date
    currentLocation?: string;
    assignedDriverId?: string;
    fuelLevel?: number; // percentage
    mileage?: number;
}

export interface Driver {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    phone: string;
    email: string;
    status: "active" | "on_leave" | "suspended";
    assignedTruckId?: string;
    rating?: number;
    totalTrips?: number;
}

export interface MaintenanceRecord {
    id: string;
    truckId: string;
    date: string;
    description: string;
    type: "scheduled" | "repair";
    cost?: number;
    provider?: string;
}
