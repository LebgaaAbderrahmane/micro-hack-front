import { BaseService, ServiceResponse } from './supabase/base.service';
import { Database } from '@/types/database.types';

export class NotificationsService extends BaseService<'notifications'> {
    constructor() {
        super('notifications');
    }
}

export type BookingAuditLogWithActor = Database['public']['Tables']['booking_audit_logs']['Row'] & {
    users: { username: string; role: string } | null;
};

export class BookingAuditLogsService extends BaseService<'booking_audit_logs'> {
    constructor() {
        super('booking_audit_logs');
    }

    async getLogsWithUsers(filters?: {
        search?: string;
        fromDate?: string;
        toDate?: string;
        users?: string[];
        activities?: string[];
    }): Promise<ServiceResponse<BookingAuditLogWithActor[]>> {
        let query = this.supabase
            .from('booking_audit_logs')
            .select(`
                *,
                users:actor_user_id (
                    username,
                    role
                )
            `)
            .order('timestamp', { ascending: false });

        if (filters?.fromDate) {
            query = query.gte('timestamp', filters.fromDate);
        }
        if (filters?.toDate) {
            query = query.lte('timestamp', filters.toDate);
        }
        if (filters?.users && filters.users.length > 0 && !filters.users.includes('All Users')) {
            // Mapping UI roles to DB roles if needed, but let's assume they match or filter by username if available
            // For now, let's filter by the role returned in the join if possible, 
            // but Supabase filtering on joins is tricky. We'll filter after fetch or use a better query.
        }

        const { data, error } = await query;

        let filteredData = data as BookingAuditLogWithActor[];

        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            filteredData = filteredData.filter(log => {
                const username = (log.users?.username || 'System').toLowerCase();
                const action = log.action_type.toLowerCase();
                const reason = (log.change_reason || '').toLowerCase();

                return username.includes(searchLower) ||
                    action.includes(searchLower) ||
                    reason.includes(searchLower);
            });
        }

        return { data: filteredData, error };
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
