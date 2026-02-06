import { usersService, organisationsService, apiClientsService } from '@/services/user.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data, error } = await usersService.getAll();
            if (error) throw error;
            return data;
        }
    });
};

export const useOrganisations = () => {
    return useQuery({
        queryKey: ['organisations'],
        queryFn: async () => {
            const { data, error } = await organisationsService.getAll();
            if (error) throw error;
            return data;
        }
    });
};

export const useApiClients = () => {
    return useQuery({
        queryKey: ['api-clients'],
        queryFn: async () => {
            const { data, error } = await apiClientsService.getAll();
            if (error) throw error;
            return data;
        }
    });
};
