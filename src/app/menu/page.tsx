'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/products/ProductCard';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { CartButton } from '@/components/cart/CartButton';
import { useCartStore } from '@/lib/store/cartStore';
import { useProductos } from '@/lib/query/useProductos';
import { Producto } from '@/types/producto';
import { remoteLog } from '@/lib/utils/remoteLog';

// Componente separado que usa useSearchParams
function MenuContent() {
  const { addItem, initCarrito } = useCartStore();

  const {
    data: productos = [],
    isLoading,
    error,
  } = useProductos();

  // Leer userId de la query string
  const searchParams = useSearchParams();
  // Telegram pasa el parámetro startapp con el userId
  const userId = searchParams.get('userId') || searchParams.get('tgWebAppStartParam') || '';
  
  useEffect(() => {
    remoteLog.info('🔍 Menu Page - Intentando leer userId', {
      userId,
      tgWebAppStartParam: searchParams.get('tgWebAppStartParam'),
      allParams: Object.fromEntries(searchParams.entries()),
      url: typeof window !== 'undefined' ? window.location.href : 'N/A'
    });

    if (userId) {
      remoteLog.info('✅ Menu Page - Inicializando carrito', { userId });
      initCarrito(userId);
    } else {
      remoteLog.warn('⚠️ Menu Page - No se encontró userId en URL', {
        searchParamsKeys: Array.from(searchParams.keys())
      });
    }
  }, [initCarrito, userId, searchParams]);

  const handleAddToCart = async (producto: Producto) => {
    try {
      remoteLog.info('Menu Page - Agregando producto', { productoId: producto.id, userId });
      await addItem(producto, 1);
      remoteLog.info('Menu Page - Producto agregado exitosamente', { productoId: producto.id });
    } catch (err) {
      remoteLog.error('Menu Page - Error agregando producto', {
        error: err instanceof Error ? err.message : String(err),
        productoId: producto.id
      });
      alert('Error al agregar el producto al carrito');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-gray)]">
      <Header />
      <div className="flex pt-16 md:pt-20">
        {/* Contenido principal */}
        <main className="flex-1 p-3 sm:p-6 lg:pr-0">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D5F3F] mb-4 sm:mb-6">Menú</h1>
            {/* Loading state */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#F5C842] border-t-transparent"></div>
                <p className="mt-4 text-[#0D5F3F]">Cargando productos...</p>
              </div>
            )}
            {/* Error state */}
            {error && (
              <div className="bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-lg p-4 text-[var(--color-error-text)]">
                {error.message || 'Error al cargar productos'}
              </div>
            )}
            {/* Grid de productos */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {productos.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
            {/* Empty state */}
            {!isLoading && !error && productos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--text-gray-500)]">No hay productos disponibles en este momento.</p>
              </div>
            )}
          </div>
        </main>
        {/* Sidebar del carrito (desktop) */}
        <aside className="hidden lg:block w-96 sticky top-20 h-[calc(100vh-5rem)] overflow-hidden">
          <CartSidebar />
        </aside>
      </div>
      {/* Botón flotante del carrito (mobile) */}
      <CartButton />
    </div>
  );
}

// Componente principal que envuelve con Suspense
export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background-gray)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#F5C842] border-t-transparent"></div>
          <p className="mt-4 text-[#0D5F3F]">Cargando menú...</p>
        </div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}