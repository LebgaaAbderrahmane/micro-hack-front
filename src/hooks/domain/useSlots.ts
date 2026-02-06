import { activeSlotsService, slotTemplatesService, slotOverridesService } from '@/services/booking.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useActiveSlots = (terminalId?: string, date?: string) => {
    return useQuery({
        queryKey: ['active-slots', terminalId, date],
        queryFn: async () => {
            // Note: BaseService getAll doesn't support filtering yet, so this gets all.
            // In a real app, you'd extend BaseService or filter client-side if small.
            // For now, we assume simple getAll and filter client side if needed or extend service later.
            const { data, error } = await activeSlotsService.getAll();
            if (error) throw error;
            return data;
        }
    });
};

export const useSlotTemplates = () => {
    return useQuery({
        queryKey: ['slot-templates'],
        queryFn: async () => {
            const { data, error } = await slotTemplatesService.getAll();
            if (error) throw error;
            return data;
        }
    });
};

export const useSlotOverrides = () => {
    return useQuery({
        queryKey: ['slot-overrides'],
        queryFn: async () => {
            const { data, error } = await slotOverridesService.getAll();
            if (error) throw error;
            return data;
        }
    });
};
