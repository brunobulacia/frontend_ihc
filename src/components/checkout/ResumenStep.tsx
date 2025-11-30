'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import type { CartItem } from '@/types/carrito';
import { useCartStore } from '@/lib/store/cartStore';
import { useCreatePedido } from '@/lib/query/usePedidos';
import Link from 'next/link';
import { remoteLog } from '@/lib/utils/remoteLog';

interface ResumenStepProps {
  direccion: string;
  items: CartItem[];
  total: number;
  envio: number;
  onVolverMenu: () => void;
}


export function ResumenStep({ 
  direccion, 
  items, 
  total, 
  envio, 
  onVolverMenu 
}: ResumenStepProps) {
  const { clearCart } = useCartStore();
  const createPedido = useCreatePedido();
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const hasCreated = useRef(false);

  // Crear pedido y limpiar carrito cuando se confirma el pedido
  const searchParams = useSearchParams();
  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;

    const crearPedido = async () => {
      try {
        // Intentar obtener userId de URL o localStorage
        const userIdFromUrl = searchParams.get('userId') || '';
        const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('telegram_user_id') : null;
        const userId = userIdFromUrl || storedUserId || '';

        remoteLog.info('🔍 ResumenStep - Intentando crear pedido', {
          userIdFromUrl,
          storedUserId,
          userId,
          allParams: Object.fromEntries(searchParams.entries()),
          direccion,
          itemsCount: items.length
        });

        if (!userId) {
          remoteLog.error('ResumenStep - userId no definido', {
            searchParamsKeys: Array.from(searchParams.keys())
          });
          throw new Error('userId no definido');
        }

        remoteLog.info('ResumenStep - Creando pedido en backend...', { userId, direccion });
        const result = await createPedido.mutateAsync({
          userId,
          direccion,
        });
        
        if (result && result.pedidoId) {
          remoteLog.info('✅ ResumenStep - Pedido creado exitosamente', {
            pedidoId: result.pedidoId
          });
          setPedidoId(result.pedidoId);
        }
        await clearCart();
        remoteLog.info('ResumenStep - Carrito limpiado');
      } catch (error) {
        remoteLog.error('ResumenStep - Error al crear pedido', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        await clearCart();
      }
    };

    crearPedido();
  }, [items, direccion, createPedido, clearCart, searchParams]);

  return (
    <div className="space-y-6 text-center">
      {/* Icono de éxito */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            className="text-green-600"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-green-text)]">
        ¡Gracias por tu compra!
      </h2>

      <p className="text-[var(--text-secondary)]">
        Tu pago está siendo procesado. Una vez confirmado, te asignaremos al repartidor más cercano.
      </p>

      {/* Información del pedido */}
      <div className="bg-[var(--background-gray-50)] rounded-xl p-6 space-y-4 text-left">
        <div>
          <div className="text-sm text-[var(--text-secondary)] mb-1">Número de pedido:</div>
          <div className="font-mono font-bold text-[var(--color-green-text)] text-lg">
            {pedidoId ? `ORD-${pedidoId.slice(0, 8).toUpperCase()}` : 'Procesando...'}
          </div>
        </div>

        <div className="h-px bg-[var(--border-gray-200)]" />

        <div>
          <div className="text-sm text-[var(--text-secondary)] mb-1">Dirección de envío:</div>
          <div className="font-medium text-[var(--color-green-text)]">{direccion}</div>
        </div>

        <div className="h-px bg-[var(--border-gray-200)]" />

        {/* Resumen de productos */}
        <div>
          <div className="text-sm text-[var(--text-secondary)] mb-3">Productos:</div>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[var(--foreground)]">
                  {item.cantidad}x {item.producto.nombre}
                </span>
                <span className="font-medium text-[var(--color-green-text)]">
                  Bs. {(item.producto.precio * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-[var(--border-gray-200)]" />

        {/* Totales */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Subtotal:</span>
            <span className="font-medium text-[var(--color-green-text)]">Bs. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Envío:</span>
            <span className="font-medium text-[var(--color-green-text)]">Bs. {envio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-[var(--border-gray-200)]">
            <span className="text-[var(--color-green-text)]">Total pagado:</span>
            <span className="text-[var(--color-orange-accent)]">Bs. {(total + envio).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Spinner de procesamiento */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-green-text)] border-t-transparent"></div>
        <p className="text-sm text-[var(--text-secondary)]">
          Procesando pago y asignando repartidor...
        </p>
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <p className="text-sm text-blue-800">
          📱 <strong>Nota:</strong> Puedes realizar el seguimiento completo de tu pedido desde la sección de mis pedidos.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3 pt-4">
        {pedidoId ? (
          <Link href={`/pedidos/${pedidoId}`}>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
            >
              Ver mi pedido
            </Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled
          >
            Creando pedido...
          </Button>
        )}
        
        <button
          onClick={onVolverMenu}
          className="w-full text-[var(--color-green-text)] hover:text-[var(--color-green-hover)] font-medium py-2 transition-colors"
        >
          Volver al menú
        </button>
      </div>
    </div>
  );
}
