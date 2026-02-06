import { bookingsService, qrTokensService } from '@/services/booking.service';
import { Booking } from '@/types/models/booking';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useBookings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await bookingsService.getAll();
      if (error) throw error;
      return data;
    },
  });

  const createBooking = useMutation({
    mutationFn: async (payload: any) => {
        const { data, error } = await bookingsService.create(payload);
        if(error) throw error;
        return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return { ...query, createBooking };
};

export const useBooking = (id: string) => {
    return useQuery({
        queryKey: ['bookings', id],
        queryFn: async () => {
            const { data, error } = await bookingsService.getById(id);
            if (error) throw error;
            return data;
        },
        enabled: !!id
    })
}

export const useQrTokens = (bookingId?: string) => {
    return useQuery({
        queryKey: ['qr-tokens', bookingId],
        queryFn: async () => {
            const { data, error } = await qrTokensService.getAll();
            if (error) throw error;
            // Filter by bookingId would logically happen here
            return data; 
        }
    });
};

