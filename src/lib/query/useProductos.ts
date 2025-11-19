import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosApi } from '@/lib/api/client';

export function useProductos() {
  return useQuery({
    queryKey: ['productos'], // Identificador único
    queryFn: productosApi.getAll, // Función que hace la petición
    select: (data) => data.filter(p => p.isActive), // Filtrar solo activos
  });
}

// hook para obtener producto por ID
export function useProducto(id: string) {
  return useQuery({
    queryKey: ['productos', id], // Key única por producto
    queryFn: () => productosApi.getById(id),
    enabled: !!id, // Solo ejecutar si hay ID
  });
}

export function useCreateProducto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productosApi.create,
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}
