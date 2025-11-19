import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Venta, CreateVentaDto } from '@/types/venta';

// Hook para obtener todas las ventas del usuario
export function useVentas(userId: string) {
  return useQuery({
    queryKey: ['ventas', userId],
    queryFn: async () => {
      const ventas = await apiClient.get<Venta[]>('/ventas');
      // Filtrar por usuario (si el backend no lo hace)
      return ventas.filter(v => v.userId === userId);
    },
    enabled: !!userId,
  });
}

// Hook para obtener una venta específica
export function useVenta(id: string) {
  return useQuery({
    queryKey: ['venta', id],
    queryFn: () => apiClient.get<Venta>(`/ventas/${id}`),
    enabled: !!id,
  });
}

// Hook para crear una venta
export function useCreateVenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVentaDto) => 
      apiClient.post<Venta>('/ventas', data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ventas', variables.userId] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['venta', data.id] });
      }
    },
  });
}
