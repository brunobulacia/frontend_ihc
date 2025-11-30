'use client';

import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { usePedidos } from '@/lib/query/usePedidos';
import { EstadoPedido } from '@/types/pedido';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Componente separado que usa useSearchParams
function PedidosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const { data: pedidos, isLoading, error } = usePedidos(userId);

  const getEstadoColor = (estado: EstadoPedido) => {
    switch (estado) {
      case EstadoPedido.ENTREGADO:
        return 'text-[var(--color-green-text)] bg-green-50';
      case EstadoPedido.PENDIENTE:
      case EstadoPedido.ACEPTADO:
        return 'text-[var(--color-yellow-primary)] bg-yellow-50';
      case EstadoPedido.EN_CAMINO:
      case EstadoPedido.RECOGIDO:
        return 'text-blue-600 bg-blue-50';
      case EstadoPedido.CANCELADO:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getEstadoTexto = (estado: EstadoPedido) => {
    switch (estado) {
      case EstadoPedido.ENTREGADO:
        return 'Entregado';
      case EstadoPedido.PENDIENTE:
        return 'En preparación';
      case EstadoPedido.ACEPTADO:
        return 'Aceptado';
      case EstadoPedido.RECOGIDO:
        return 'Recogido';
      case EstadoPedido.EN_CAMINO:
        return 'En camino';
      case EstadoPedido.CANCELADO:
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background-beige)]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Botón regresar */}
        <button
          onClick={() => router.push('/menu')}
          className="flex items-center gap-2 text-[var(--color-orange-accent)] hover:text-[var(--color-orange-hover)] mb-6 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Regresar a Menú</span>
        </button>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-green-text)] mb-2">Mis Pedidos</h1>
          <p className="text-[var(--text-secondary)]">Historial de tus pedidos</p>
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-green-text)] mx-auto"></div>
              <p className="mt-4 text-[var(--text-secondary)]">Cargando pedidos...</p>
            </div>
          )}

          {error && (
            <div className="bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-lg p-4 text-center">
              <p className="text-[var(--color-error-text)]">Error al cargar los pedidos</p>
            </div>
          )}

          {!isLoading && !error && pedidos && pedidos.length === 0 && (
            <div className="text-center py-12 bg-[var(--background)] rounded-2xl shadow-lg">
              <svg className="w-16 h-16 mx-auto text-[var(--text-secondary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium text-[var(--foreground)] mb-2">No tienes pedidos aún</p>
              <p className="text-[var(--text-secondary)] mb-6">Comienza ordenando tu comida favorita</p>
              <Link
                href="/menu"
                className="inline-block bg-[var(--color-green-text)] hover:bg-[var(--color-green-hover)] text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Ver Menú
              </Link>
            </div>
          )}

          {pedidos?.map((pedido: { id: string; estado: EstadoPedido; fechaCreacion: string; total: number; detallesPedido?: Array<{ id: string; cantidad: number; producto: { nombre: string } }> }) => (
            <Link
              key={pedido.id}
              href={`/pedidos/${pedido.id}`}
              className="block bg-[var(--background)] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-[var(--color-green-text)]">
                      ORD-{pedido.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getEstadoColor(pedido.estado)}`}>
                      {getEstadoTexto(pedido.estado)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {formatDate(pedido.fechaCreacion)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Total</p>
                  <p className="text-xl font-bold text-[var(--color-green-text)]">
                    Bs. {pedido.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--border-gray-200)] pt-4">
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  Productos: {pedido.detallesPedido?.length || 0}
                </p>
                {pedido.detallesPedido && pedido.detallesPedido.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pedido.detallesPedido.slice(0, 3).map((detalle: { id: string; cantidad: number; producto: { nombre: string } }) => (
                      <span
                        key={detalle.id}
                        className="text-xs bg-[var(--background-gray-50)] text-[var(--foreground)] px-2 py-1 rounded"
                      >
                        {detalle.cantidad}x {detalle.producto.nombre}
                      </span>
                    ))}
                    {pedido.detallesPedido.length > 3 && (
                      <span className="text-xs text-[var(--text-secondary)] px-2 py-1">
                        +{pedido.detallesPedido.length - 3} más
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end mt-4 text-[var(--color-orange-accent)] font-medium text-sm">
                <span>Ver detalles</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

// Componente principal que exportas
export default function PedidosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background-beige)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-green-text)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Cargando pedidos...</p>
        </div>
      </div>
    }>
      <PedidosContent />
    </Suspense>
  );
}