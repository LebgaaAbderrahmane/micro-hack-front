import { portsService, gatesService, gateLanesService, gateLogsService } from '@/services/infrastructure.service';
import { useQuery } from '@tanstack/react-query';

export const usePorts = () => {
    return useQuery({
        queryKey: ['ports'],
        queryFn: async () => {
            const { data, error } = await portsService.getAll();
            if (error) throw error;
            return data;
        }
    });
};

export const useGates = (portId?: string) => {
    return useQuery({
        queryKey: ['gates', portId],
        queryFn: async () => {
            const { data, error } = await gatesService.getAll();
            if (error) throw error;
            return data; // Needs filtering by portId in real implementation
        }
    });
};

export const useGateLanes = (gateId?: string) => {
    return useQuery({
        queryKey: ['gate-lanes', gateId],
        queryFn: async () => {
            const { data, error } = await gateLanesService.getAll();
            if (error) throw error;
            return data;
        }
    });
};

export const useGateLogs = () => {
    return useQuery({
        queryKey: ['gate-logs'],
        queryFn: async () => {
            const { data, error } = await gateLogsService.getAll();
            if (error) throw error;
            return data;
        }
    });
};
