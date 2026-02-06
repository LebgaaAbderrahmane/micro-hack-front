import { http, HttpResponse } from "msw";

export const handlers = [
    // Auth
    http.post("/api/auth/login", async ({ request }) => {
        const info = await request.json() as { email: string };
        return HttpResponse.json({
            id: "1",
            email: info.email,
            role: info.email.includes("admin") ? "admin" : info.email.includes("op") ? "terminal_op" : "carrier",
            firstName: "Mock",
            lastName: "User",
            token: "mock-jwt-token",
        });
    }),

    // Terminals
    http.get("/api/terminals", () => {
        return HttpResponse.json([
            { id: "1", name: "Terminal North", status: "active", capacity: 92, lat: 51.505, lng: -0.09 },
            { id: "2", name: "Terminal South", status: "active", capacity: 45, lat: 51.51, lng: -0.1 },
            { id: "3", name: "Terminal West", status: "maintenance", capacity: 78, lat: 51.49, lng: -0.08 },
        ]);
    }),

    // Bookings
    http.get("/api/bookings", () => {
        return HttpResponse.json([
            { id: "1", truckId: "TRK-991", carrier: "TransGlobal", status: "booked", time: "12m" },
            { id: "2", truckId: "TRK-882", carrier: "PortExpress", status: "checking-in", time: "5m" },
            { id: "3", truckId: "TRK-773", carrier: "Oceanic", status: "loading", time: "Now" },
        ]);
    }),

    // Notifications
    http.get("/api/notifications", () => {
        return HttpResponse.json([
            { id: "1", type: "warning", title: "Capacity Alert", message: "Terminal North > 90%", time: "12m ago" },
            { id: "2", type: "info", title: "Ship Arriving", message: "Evergreen Marine arriving 14:00", time: "45m ago" },
        ]);
    }),

    // Fleet - Trucks
    http.get("/api/fleet/trucks", () => {
        return HttpResponse.json([
            { id: "T01", licensePlate: "TX-992-BK", model: "Volvo FH16", year: 2022, status: "in_transit", lastMaintenance: "2024-01-15", nextMaintenance: "2024-07-15", fuelLevel: 65, mileage: 45000 },
            { id: "T02", licensePlate: "TX-881-AL", model: "Scania R500", year: 2023, status: "active", lastMaintenance: "2024-02-01", nextMaintenance: "2024-08-01", fuelLevel: 82, mileage: 12000 },
            { id: "T03", licensePlate: "TX-773-MN", model: "Mercedes Actros", year: 2021, status: "maintenance", lastMaintenance: "2023-11-20", nextMaintenance: "2024-02-20", fuelLevel: 15, mileage: 120000 },
        ]);
    }),

    // Fleet - Drivers
    http.get("/api/fleet/drivers", () => {
        return HttpResponse.json([
            { id: "D01", firstName: "John", lastName: "Doe", licenseNumber: "L-112233", phone: "+1 234 567 890", email: "john.doe@example.com", status: "active", assignedTruckId: "T01", rating: 4.8, totalTrips: 156 },
            { id: "D02", firstName: "Sarah", lastName: "Smith", licenseNumber: "L-445566", phone: "+1 234 567 891", email: "sarah.smith@example.com", status: "active", assignedTruckId: "T02", rating: 4.9, totalTrips: 210 },
        ]);
    }),
];
