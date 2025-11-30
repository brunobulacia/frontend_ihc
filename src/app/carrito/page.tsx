'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/Button';

function CarritoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const { items, updateItemQuantity, removeItem, getTotal, getItemCount } = useCartStore();

  const handleCheckout = () => {
    router.push(`/checkout?userId=${userId}`);
  };

  const subtotal = getTotal();
  const envio = subtotal > 0 ? 5.0 : 0;
  const total = subtotal + envio;
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-[var(--background-beige)]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Botón regresar */}
        <button
          onClick={() => router.push(`/menu?userId=${userId}`)}
          className="flex items-center gap-2 text-[var(--color-orange-accent)] hover:text-[var(--color-orange-hover)] mb-6 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Regresar a Menú</span>
        </button>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-green-text)] mb-2">Mi Carrito</h1>
          <p className="text-[var(--text-secondary)]">
            {itemCount === 0 ? 'Tu carrito está vacío' : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
          </p>
        </div>

        {/* Carrito vacío */}
        {items.length === 0 && (
          <div className="text-center py-12 bg-[var(--background)] rounded-2xl shadow-lg">
            <svg className="w-16 h-16 mx-auto text-[var(--text-secondary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-lg font-medium text-[var(--foreground)] mb-2">Tu carrito está vacío</p>
            <p className="text-[var(--text-secondary)] mb-6">Agrega productos del menú para comenzar tu pedido</p>
            <Button
              onClick={() => router.push(`/menu?userId=${userId}`)}
              className="bg-[var(--color-green-text)] hover:bg-[var(--color-green-hover)]"
            >
              Ver Menú
            </Button>
          </div>
        )}

        {/* Lista de items */}
        {items.length > 0 && (
          <div className="space-y-6">
            {/* Items del carrito */}
            <div className="bg-[var(--background)] rounded-2xl shadow-lg p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-[var(--border-gray-200)] last:border-0 last:pb-0">
                  {/* Imagen del producto */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--background-gray-50)]">
                    <img
                      src="/chicken-plate.jpg"
                      alt={item.producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Detalles del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">{item.producto?.nombre}</h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mb-2">
                      {item.producto?.descripcion}
                    </p>
                    <p className="text-lg font-bold text-[var(--color-green-text)]">
                      Bs. {item.producto?.precio.toFixed(2)}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, Math.max(1, item.cantidad - 1))}
                        className="w-8 h-8 rounded-full bg-[var(--background-gray-50)] hover:bg-[var(--background-gray)] flex items-center justify-center transition-colors"
                        disabled={item.cantidad <= 1}
                      >
                        <span className="text-lg font-semibold text-[var(--foreground)]">−</span>
                      </button>
                      <span className="w-8 text-center font-semibold text-[var(--foreground)]">{item.cantidad}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.cantidad + 1)}
                        className="w-8 h-8 rounded-full bg-[var(--color-green-text)] hover:bg-[var(--color-green-hover)] flex items-center justify-center transition-colors"
                      >
                        <span className="text-lg font-semibold text-white">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen de precios */}
            <div className="bg-[var(--background)] rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--color-green-text)] mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[var(--foreground)]">
                  <span>Subtotal</span>
                  <span className="font-semibold">Bs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--foreground)]">
                  <span>Envío</span>
                  <span className="font-semibold">Bs. {envio.toFixed(2)}</span>
                </div>
                <div className="border-t border-[var(--border-gray-200)] pt-3">
                  <div className="flex justify-between text-[var(--color-green-text)]">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">Bs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-[var(--color-green-text)] hover:bg-[var(--color-green-hover)] text-white py-3"
              >
                Proceder al Pago
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CarritoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background-beige)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-green-text)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Cargando carrito...</p>
        </div>
      </div>
    }>
      <CarritoContent />
    </Suspense>
  );
}
