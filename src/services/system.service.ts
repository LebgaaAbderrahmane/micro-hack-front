import { BaseService } from './supabase/base.service';

export class NotificationsService extends BaseService<'notifications'> {
    constructor() {
        super('notifications');
    }
}

export class BookingAuditLogsService extends BaseService<'booking_audit_logs'> {
    constructor() {
        super('booking_audit_logs');
    }
}

export class AiAgentsService extends BaseService<'ai_agents'> {
    constructor() {
        super('ai_agents');
    }
}

export const notificationsService = new NotificationsService();
export const bookingAuditLogsService = new BookingAuditLogsService();
export const aiAgentsService = new AiAgentsService();
