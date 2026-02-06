import { containersService } from '@/services/booking.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useContainers = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['containers'],
    queryFn: async () => {
      const { data, error } = await containersService.getAll();
      if (error) throw error;
      return data;
    },
  });

  const createContainer = useMutation({
      mutationFn: async (payload: any) => {
          const { data, error } = await containersService.create(payload);
          if (error) throw error;
          return data;
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['containers'] });
      }
  });

  return { ...query, createContainer };
};

export const useContainer = (id: string) => {
    return useQuery({
        queryKey: ['containers', id],
        queryFn: async () => {
            const { data, error } = await containersService.getById(id);
            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
};
