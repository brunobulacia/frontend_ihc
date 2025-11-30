import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Pedido, CreatePedidoDto } from '@/types/pedido';

// Hook para obtener todos los pedidos del usuario
export function usePedidos(userId: string) {
  return useQuery({
    queryKey: ['pedidos', userId],
    queryFn: async () => {
      const pedidos = await apiClient.get<Pedido[]>(`/pedidos?userId=${userId}`);
      return pedidos;
    },
    enabled: !!userId,
  });
}

// Hook para obtener un pedido específico
export function usePedido(id: string) {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: () => apiClient.get<Pedido>(`/pedidos/${id}`),
    enabled: !!id,
  });
}

// Hook para crear un pedido (usar el endpoint de compra)
export function useCreatePedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePedidoDto) => 
      apiClient.post<{ pedidoId: string; total: number }>('/compra', data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.userId] });
      if (data?.pedidoId) {
        queryClient.invalidateQueries({ queryKey: ['pedido', data.pedidoId] });
      }
    },
  });
}
