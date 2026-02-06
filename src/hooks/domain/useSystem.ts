import { notificationsService, bookingAuditLogsService, aiAgentsService } from '@/services/system.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useNotifications = (userId?: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['notifications', userId],
        queryFn: async () => {
            const { data, error } = await notificationsService.getAll();
            if (error) throw error;
            // Filter by userId if provided would happen here or in service
            return data;
        },
        enabled: !!userId
    });

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await notificationsService.update(id, { is_read: true, read_at: new Date().toISOString() });
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    return { ...query, markAsRead };
};

export const useBookingAuditLogs = (bookingId?: string) => {
    return useQuery({
        queryKey: ['booking-audit-logs', bookingId],
        queryFn: async () => {
            const { data, error } = await bookingAuditLogsService.getAll();
            if (error) throw error;
            return data;
        }
    });
};

export const useAiAgents = () => {
    return useQuery({
        queryKey: ['ai-agents'],
        queryFn: async () => {
            const { data, error } = await aiAgentsService.getAll();
            if (error) throw error;
            return data;
        }
    });
};
