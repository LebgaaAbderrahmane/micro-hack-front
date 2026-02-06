export type BookingStatus = "pending" | "confirmed" | "rejected" | "consumed" | "cancelled";

export interface Booking {
    id: string;
    bookingNumber: string;
    carrierId: string;
    terminalId: string;
    terminalName: string;
    slot: {
        date: string; // ISO string
        startTime: string;
        endTime: string;
    };
    truck: {
        id: string;
        licensePlate: string;
        driverName: string;
        driverPhone: string;
    };
    status: BookingStatus;
    cargoDetails?: {
        type: string;
        weight: number;
        description: string;
    };
    qrCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface TerminalSlot {
    id: string;
    startTime: string;
    endTime: string;
    capacity: number;
    available: number;
}
