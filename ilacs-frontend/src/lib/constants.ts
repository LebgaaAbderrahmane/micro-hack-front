/**
 * ILACS - Production Constants
 * Centralized configuration for consistent UX across the application
 */

// Component Heights
export const COMPONENT_HEIGHTS = {
    STAT_SMALL: 'h-[160px]',
    STAT_MEDIUM: 'h-[240px]',
    STAT_LARGE: 'h-[320px]',
    CHART: 'h-[200px]',
    TERMINAL_MATRIX: 'h-[750px]',
    NAVBAR: 'h-20',
    MODAL_SM: 'max-h-[400px]',
    MODAL_MD: 'max-h-[600px]',
    MODAL_LG: 'max-h-[800px]',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    TOAST: 5000,
} as const;

// Booking Wizard Steps
export const BOOKING_STEPS = [
    { id: 1, name: 'Terminal', description: 'Select terminal and check availability' },
    { id: 2, name: 'Date & Time', description: 'Choose your preferred slot' },
    { id: 3, name: 'Truck Assignment', description: 'Assign truck and driver' },
    { id: 4, name: 'Review', description: 'Confirm booking details' },
] as const;

// Slot Time Intervals (in minutes)
export const SLOT_INTERVALS = {
    STANDARD: 30,
    EXPRESS: 15,
    EXTENDED: 60,
} as const;

// Availability Status Colors
export const AVAILABILITY_COLORS = {
    AVAILABLE: 'bg-success/10 border-success text-success',
    LIMITED: 'bg-warning/10 border-warning text-warning',
    FULL: 'bg-error/10 border-error text-error',
    CLOSED: 'bg-foreground/5 border-foreground/20 text-foreground/40',
} as const;

// Truck Status Colors (for Terminal Operator grid)
export const TRUCK_STATUS_COLORS = {
    CHECKED_IN: 'bg-blue-500 shadow-blue-500/40',
    IN_PROGRESS: 'bg-green-500 shadow-green-500/40',
    DELAYED: 'bg-orange-500 shadow-orange-500/40',
    CRITICAL: 'bg-red-500 shadow-red-500/40',
    COMPLETED: 'bg-gray-400 shadow-gray-400/40',
} as const;

// Notification Priorities
export const NOTIFICATION_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
} as const;

// WebSocket Events
export const WS_EVENTS = {
    // Server → Client
    TERMINAL_UPDATE: 'terminal:update',
    BOOKING_UPDATE: 'booking:update',
    TRUCK_MOVEMENT: 'truck:movement',
    NOTIFICATION_NEW: 'notification:new',
    CAPACITY_ALERT: 'capacity:alert',
    SLOT_AVAILABILITY_CHANGE: 'slot:availability',

    // Client → Server
    SUBSCRIBE_TERMINAL: 'subscribe:terminal',
    UNSUBSCRIBE_TERMINAL: 'unsubscribe:terminal',
    ACK_NOTIFICATION: 'ack:notification',
    REQUEST_SLOT_UPDATE: 'request:slot_update',
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
    },
    BOOKINGS: {
        LIST: '/api/bookings',
        CREATE: '/api/bookings/create',
        UPDATE: '/api/bookings/:id',
        DELETE: '/api/bookings/:id',
        AVAILABILITY: '/api/bookings/availability',
    },
    TERMINALS: {
        LIST: '/api/terminals',
        DETAILS: '/api/terminals/:id',
        CAPACITY: '/api/terminals/:id/capacity',
        SLOTS: '/api/terminals/:id/slots',
    },
    NOTIFICATIONS: {
        LIST: '/api/notifications',
        MARK_READ: '/api/notifications/:id/read',
        MARK_ALL_READ: '/api/notifications/read-all',
        DELETE: '/api/notifications/:id',
    },
    QR: {
        GENERATE: '/api/qr/generate',
        VALIDATE: '/api/qr/validate',
    },
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
    ISO: 'yyyy-MM-dd',
    TIME_ONLY: 'HH:mm',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'ilacs_auth_token',
    USER_DATA: 'ilacs_user_data',
    THEME_PREFERENCE: 'ilacs_theme',
    BOOKING_DRAFT: 'ilacs_booking_draft',
    NOTIFICATION_PREFERENCES: 'ilacs_notification_prefs',
} as const;

// Validation Rules
export const VALIDATION = {
    BOOKING: {
        MIN_ADVANCE_HOURS: 2,
        MAX_ADVANCE_DAYS: 30,
        CANCELLATION_HOURS: 24,
        MODIFICATION_HOURS: 12,
    },
    TRUCK: {
        PLATE_NUMBER_MIN: 4,
        PLATE_NUMBER_MAX: 12,
    },
    COMPANY: {
        NAME_MIN: 2,
        NAME_MAX: 100,
    },
} as const;
