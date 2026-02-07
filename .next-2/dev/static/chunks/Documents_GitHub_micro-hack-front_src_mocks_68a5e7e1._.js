(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/micro-hack-front/src/mocks/handlers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handlers",
    ()=>handlers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/msw/lib/core/http.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/msw/lib/core/HttpResponse.mjs [app-client] (ecmascript)");
;
const handlers = [
    // Auth
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].post("/api/auth/login", async ({ request })=>{
        const info = await request.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json({
            id: "1",
            email: info.email,
            role: info.email.includes("admin") ? "ADMIN" : info.email.includes("op") ? "OPERATOR" : "DISPATCHER",
            firstName: "Mock",
            lastName: "User",
            token: "mock-jwt-token"
        });
    }),
    // Supabase Mock (REST)
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].get("*/rest/v1/users*", ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json({
            id: "1",
            role: "ADMIN",
            username: "admin_user",
            org_id: "org-1",
            organisation: {
                id: "org-1",
                name: "System Admin Org",
                nif: "123456789",
                type: "ADMIN"
            }
        });
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].get("*/auth/v1/session", ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json({
            session: null
        });
    }),
    // Terminals
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].get("/api/terminals", ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json([
            {
                id: "1",
                name: "Terminal North",
                status: "active",
                capacity: 92,
                lat: 51.505,
                lng: -0.09
            },
            {
                id: "2",
                name: "Terminal South",
                status: "active",
                capacity: 45,
                lat: 51.51,
                lng: -0.1
            },
            {
                id: "3",
                name: "Terminal West",
                status: "maintenance",
                capacity: 78,
                lat: 51.49,
                lng: -0.08
            }
        ]);
    }),
    // Bookings
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].get("/api/bookings", ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json([
            {
                id: "1",
                truckId: "TRK-991",
                carrier: "TransGlobal",
                status: "booked",
                time: "12m"
            },
            {
                id: "2",
                truckId: "TRK-882",
                carrier: "PortExpress",
                status: "checking-in",
                time: "5m"
            },
            {
                id: "3",
                truckId: "TRK-773",
                carrier: "Oceanic",
                status: "loading",
                time: "Now"
            }
        ]);
    }),
    // Notifications
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].get("/api/notifications", ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json([
            {
                id: "1",
                type: "warning",
                title: "Capacity Alert",
                message: "Terminal North > 90%",
                time: "12m ago"
            },
            {
                id: "2",
                type: "info",
                title: "Ship Arriving",
                message: "Evergreen Marine arriving 14:00",
                time: "45m ago"
            }
        ]);
    }),
    // Fleet - Trucks
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].get("/api/fleet/trucks", ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json([
            {
                id: "T01",
                licensePlate: "TX-992-BK",
                model: "Volvo FH16",
                year: 2022,
                status: "in_transit",
                lastMaintenance: "2024-01-15",
                nextMaintenance: "2024-07-15",
                fuelLevel: 65,
                mileage: 45000
            },
            {
                id: "T02",
                licensePlate: "TX-881-AL",
                model: "Scania R500",
                year: 2023,
                status: "active",
                lastMaintenance: "2024-02-01",
                nextMaintenance: "2024-08-01",
                fuelLevel: 82,
                mileage: 12000
            },
            {
                id: "T03",
                licensePlate: "TX-773-MN",
                model: "Mercedes Actros",
                year: 2021,
                status: "maintenance",
                lastMaintenance: "2023-11-20",
                nextMaintenance: "2024-02-20",
                fuelLevel: 15,
                mileage: 120000
            }
        ]);
    }),
    // Fleet - Drivers
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$http$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"].get("/api/fleet/drivers", ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$core$2f$HttpResponse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpResponse"].json([
            {
                id: "D01",
                firstName: "John",
                lastName: "Doe",
                licenseNumber: "L-112233",
                phone: "+1 234 567 890",
                email: "john.doe@example.com",
                status: "active",
                assignedTruckId: "T01",
                rating: 4.8,
                totalTrips: 156
            },
            {
                id: "D02",
                firstName: "Sarah",
                lastName: "Smith",
                licenseNumber: "L-445566",
                phone: "+1 234 567 891",
                email: "sarah.smith@example.com",
                status: "active",
                assignedTruckId: "T02",
                rating: 4.9,
                totalTrips: 210
            }
        ]);
    })
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/micro-hack-front/src/mocks/browser.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "worker",
    ()=>worker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$browser$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/msw/lib/browser/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$mocks$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/src/mocks/handlers.ts [app-client] (ecmascript)");
;
;
const worker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$msw$2f$lib$2f$browser$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setupWorker"])(...__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$mocks$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handlers"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_GitHub_micro-hack-front_src_mocks_68a5e7e1._.js.map