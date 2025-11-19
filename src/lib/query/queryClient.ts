import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient de React Query
 * Configuración global para todas las peticiones
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" (no se refrescan)
      staleTime: 1000 * 60 * 5, // 5 minutos
      
      // Tiempo que los datos se mantienen en caché
      gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
      
      // Reintentar peticiones fallidas
      retry: 1,
      
      // Refrescar cuando el usuario vuelve a la ventana
      refetchOnWindowFocus: false,
      
      // Refrescar cuando se reconecta
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentar mutaciones fallidas
      retry: 0,
    },
  },
});
