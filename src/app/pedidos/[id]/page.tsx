'use client';

import { use } from 'react';
import { Header } from '@/components/layout/Header';
import { useVenta } from '@/lib/query/useVentas';
import { EstadoVenta, EstadoPago } from '@/types/venta';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetallePedidoPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: venta, isLoading, error } = useVenta(id);

  const getEstadoColor = (estado: EstadoVenta) => {
    switch (estado) {
      case EstadoVenta.COMPLETADA:
        return 'text-[var(--color-green-text)] bg-green-50';
      case EstadoVenta.PENDIENTE:
        return 'text-[var(--color-yellow-primary)] bg-yellow-50';
      case EstadoVenta.CANCELADA:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getEstadoTexto = (estado: EstadoVenta) => {
    switch (estado) {
      case EstadoVenta.COMPLETADA:
        return 'Entregado';
      case EstadoVenta.PENDIENTE:
        return 'En preparación';
      case EstadoVenta.CANCELADA:
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoStep = (estado: EstadoVenta): number => {
    switch (estado) {
      case EstadoVenta.PENDIENTE:
        return 2;
      case EstadoVenta.COMPLETADA:
        return 5;
      case EstadoVenta.CANCELADA:
        return 0;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-beige)]">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-green-text)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Cargando pedido...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !venta) {
    return (
      <div className="min-h-screen bg-[var(--background-beige)]">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-lg p-4 text-center">
            <p className="text-[var(--color-error-text)]">No se pudo cargar el pedido</p>
          </div>
        </main>
      </div>
    );
  }

  const currentStep = getEstadoStep(venta.estado);
  const subtotal = venta.detalleVentas?.reduce((sum: number, det: { precioUnit: number; cantidad: number }) => sum + (det.precioUnit * det.cantidad), 0) || 0;
  const envio = venta.total - subtotal;

  return (
    <div className="min-h-screen bg-[var(--background-beige)]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Botón regresar */}
        <button
          onClick={() => router.push('/pedidos')}
          className="flex items-center gap-2 text-[var(--color-orange-accent)] hover:text-[var(--color-orange-hover)] mb-6 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Regresar a Mis pedidos</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Timeline de estado */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header del pedido */}
            <div className="bg-[var(--background)] rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-green-text)] mb-2">
                    ORD-{venta.id.slice(0, 8).toUpperCase()}
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Pedido realizado el {formatDate(venta.fechaVenta)}
                  </p>
                </div>
                <span className={`text-sm font-medium px-4 py-2 rounded-full ${getEstadoColor(venta.estado)}`}>
                  {getEstadoTexto(venta.estado)}
                </span>
              </div>
            </div>

            {/* Timeline del pedido */}
            {venta.estado !== EstadoVenta.CANCELADA && (
              <div className="bg-[var(--background)] rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-lg text-[var(--color-green-text)] mb-6">
                  Estado del pedido
                </h2>

                <div className="space-y-6">
                  {/* Paso 1: Pedido confirmado */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        currentStep >= 1 ? 'bg-[var(--color-green-text)]' : 'bg-[var(--background-gray-200)]'
                      }`}>
                        ✓
                      </div>
                      {currentStep > 1 && <div className="w-0.5 h-12 bg-[var(--color-green-text)] mt-2" />}
                      {currentStep === 1 && <div className="w-0.5 h-12 bg-[var(--background-gray-200)] mt-2" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium text-[var(--foreground)]">Pedido confirmado</p>
                      <p className="text-sm text-[var(--text-secondary)]">Tu pedido ha sido recibido</p>
                    </div>
                  </div>

                  {/* Paso 2: En preparación */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        currentStep >= 2 ? 'bg-[var(--color-green-text)]' : 'bg-[var(--background-gray-200)]'
                      }`}>
                        {currentStep >= 2 ? '✓' : '2'}
                      </div>
                      {currentStep > 2 && <div className="w-0.5 h-12 bg-[var(--color-green-text)] mt-2" />}
                      {currentStep <= 2 && <div className="w-0.5 h-12 bg-[var(--background-gray-200)] mt-2" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium text-[var(--foreground)]">Preparando</p>
                      <p className="text-sm text-[var(--text-secondary)]">Estamos preparando tu pedido</p>
                    </div>
                  </div>

                  {/* Paso 3: Listo para entregar */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        currentStep >= 3 ? 'bg-[var(--color-green-text)]' : 'bg-[var(--background-gray-200)]'
                      }`}>
                        {currentStep >= 3 ? '✓' : '3'}
                      </div>
                      {currentStep > 3 && <div className="w-0.5 h-12 bg-[var(--color-green-text)] mt-2" />}
                      {currentStep <= 3 && <div className="w-0.5 h-12 bg-[var(--background-gray-200)] mt-2" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium text-[var(--foreground)]">Listo para entregar</p>
                      <p className="text-sm text-[var(--text-secondary)]">Tu pedido está listo</p>
                    </div>
                  </div>

                  {/* Paso 4: En camino */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        currentStep >= 4 ? 'bg-[var(--color-green-text)]' : 'bg-[var(--background-gray-200)]'
                      }`}>
                        {currentStep >= 4 ? '✓' : '4'}
                      </div>
                      {currentStep > 4 && <div className="w-0.5 h-12 bg-[var(--color-green-text)] mt-2" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium text-[var(--foreground)]">En Camino</p>
                      <p className="text-sm text-[var(--text-secondary)]">El repartidor va hacia tu ubicación</p>
                      {currentStep === 4 && (
                        <p className="text-xs text-[var(--color-orange-accent)] mt-1">Hora estimada 20:30 - 20:45</p>
                      )}
                    </div>
                  </div>

                  {/* Paso 5: Entregado */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        currentStep >= 5 ? 'bg-[var(--color-green-text)]' : 'bg-[var(--background-gray-200)]'
                      }`}>
                        {currentStep >= 5 ? '✓' : '5'}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium text-[var(--foreground)]">Entregado</p>
                      <p className="text-sm text-[var(--text-secondary)]">¡Disfruta tu comida!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Productos */}
            <div className="bg-[var(--background)] rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-lg text-[var(--color-green-text)] mb-4">Productos</h2>
              
              <div className="space-y-3">
                {venta.detalleVentas?.map((detalle: { id: string; producto: { nombre: string }; cantidad: number; precioUnit: number }) => (
                  <div key={detalle.id} className="flex justify-between items-start py-3 border-b border-[var(--border-gray-200)] last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-[var(--foreground)]">{detalle.producto.nombre}</p>
                      <p className="text-sm text-[var(--text-secondary)]">Cantidad: {detalle.cantidad}</p>
                    </div>
                    <p className="font-bold text-[var(--color-green-text)]">
                      Bs. {(detalle.precioUnit * detalle.cantidad).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="space-y-6">
            <div className="bg-[var(--background)] rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="font-bold text-lg text-[var(--color-green-text)] mb-4">Resumen</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal:</span>
                  <span className="font-medium text-[var(--color-green-text)]">Bs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Envío:</span>
                  <span className="font-medium text-[var(--color-green-text)]">Bs. {envio.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-[var(--border-gray-200)] pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[var(--foreground)]">Total:</span>
                  <span className="font-bold text-xl text-[var(--color-green-text)]">
                    Bs. {venta.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {venta.pago && (
                <div className="mt-4 pt-4 border-t border-[var(--border-gray-200)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">Método de pago</p>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    <span className="font-medium text-[var(--foreground)]">
                      {venta.pago.metodoPago.metodo}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 px-2 py-1 inline-block rounded ${
                    venta.pago.estado === EstadoPago.COMPLETADO
                      ? 'bg-green-50 text-green-700'
                      : venta.pago.estado === EstadoPago.PENDIENTE
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {venta.pago.estado === EstadoPago.COMPLETADO ? 'Pagado' : 
                     venta.pago.estado === EstadoPago.PENDIENTE ? 'Pendiente' : 'Fallido'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
