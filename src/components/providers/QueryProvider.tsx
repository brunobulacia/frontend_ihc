'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query/queryClient';
import { ReactNode } from 'react';

/**
 * Provider de React Query
 * Envuelve la app para dar acceso a useQuery y useMutation
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Panel de desarrollo (solo en dev) para ver queries en tiempo real */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
