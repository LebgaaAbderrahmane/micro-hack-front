import { terminalsService } from '@/services/infrastructure.service';
import { useQuery } from '@tanstack/react-query';

export const useTerminals = () => {
  const query = useQuery({
    queryKey: ['terminals'],
    queryFn: async () => {
      const { data, error } = await terminalsService.getAll();
      if (error) throw error;
      return data;
    },
  });

  return query;
};

export const useTerminal = (id: string) => {
    return useQuery({
        queryKey: ['terminals', id],
        queryFn: async () => {
            const { data, error } = await terminalsService.getById(id);
            if (error) throw error;
            return data;
        },
        enabled: !!id
    })
}
