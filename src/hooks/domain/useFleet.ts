import { trucksService, driversService } from '@/services/fleet.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useFleet = () => {
  const query = useQuery({
    queryKey: ['fleet'],
    queryFn: async () => {
      const [trucksRes, driversRes] = await Promise.all([
          trucksService.getAll(),
          driversService.getAll()
      ]);
      
      if (trucksRes.error) throw trucksRes.error;
      if (driversRes.error) throw driversRes.error;

      return {
          trucks: trucksRes.data,
          drivers: driversRes.data
      };
    },
  });

  return query;
};
