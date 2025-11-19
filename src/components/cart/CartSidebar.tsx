'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/Button';

export function CartSidebar() {
  const router = useRouter();
  const { items, isOpen, toggleSidebar, removeItem, updateItemQuantity, getTotal, getItemCount } = useCartStore();

  const total = getTotal();
  const itemCount = getItemCount();
  const envio = 5; // Tarifa fija de envío

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[var(--background)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-[var(--color-green-text)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-[var(--text-white)] font-bold text-xl">Mi Pedido</h2>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-[var(--text-white)] hover:bg-[var(--background)]/20 rounded-full p-2 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-[var(--text-gray-500)]">Tu carrito está vacío</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--background-gray-50)] rounded-xl p-4 flex gap-3"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-green-text)] text-sm">
                      {item.producto.nombre}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {item.producto.descripcion}
                    </p>

                    {/* Controles de cantidad y precio */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-[var(--background)] rounded-full px-2 py-1 border border-[var(--border-gray-200)]">
                        <button
                          onClick={() => updateItemQuantity(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          className="w-6 h-6 flex items-center justify-center text-[var(--color-green-text)] hover:bg-[var(--background-gray-100)] rounded-full transition-colors disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-[var(--color-green-text)] text-sm">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateItemQuantity(item.id, item.cantidad + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[var(--color-green-text)] hover:bg-[var(--background-gray-100)] rounded-full transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-bold text-[var(--color-green-text)]">
                        Bs. {(item.producto.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[var(--color-error-text-red)] hover:bg-[var(--color-error-bg)] rounded-lg p-2 h-fit transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer con resumen */}
          {items.length > 0 && (
            <div className="border-t border-[var(--border-gray-200)] p-6 space-y-4">
              {/* Campo de observación */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-green-text)] mb-2">
                  Observación:
                </label>
                <textarea
                  placeholder="Ej: Sin cebolla, sin cilantro..."
                  className="w-full px-3 py-2 border border-[var(--background-gray-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-yellow-primary)] resize-none"
                  rows={2}
                />
              </div>

              {/* Resumen de costos */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal:</span>
                  <span className="font-medium text-[var(--color-green-text)]">Bs. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Envío:</span>
                  <span className="font-medium text-[var(--color-green-text)]">Bs. {envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--border-gray-200)]">
                  <span className="text-[var(--color-green-text)]">Total:</span>
                  <span className="text-[var(--color-green-text)]">Bs. {(total + envio).toFixed(2)}</span>
                </div>
              </div>

              {/* Botón proceder al pago */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => router.push('/checkout')}
              >
                Proceder al Pago →
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
