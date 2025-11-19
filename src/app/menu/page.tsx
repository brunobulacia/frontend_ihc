'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/products/ProductCard';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { CartButton } from '@/components/cart/CartButton';
import { useCartStore } from '@/lib/store/cartStore';
import { productosApi } from '@/lib/api/client';
import { Producto } from '@/types/producto';

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addItem, initCarrito } = useCartStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Inicializar carrito (usar un userId temporal por ahora)
        // TODO: Obtener userId real cuando implementes auth
        await initCarrito('temp-user-id');
        
        // Cargar productos
        const productosData = await productosApi.getAll();
        setProductos(productosData.filter(p => p.isActive));
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los productos. Por favor intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [initCarrito]);

  const handleAddToCart = async (producto: Producto) => {
    try {
      await addItem(producto, 1);
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      alert('Error al agregar el producto al carrito');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="flex pt-20">
        {/* Contenido principal */}
        <main className="flex-1 p-6 lg:pr-0">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#0D5F3F] mb-6">Menú:</h1>

            {/* Loading state */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#F5C842] border-t-transparent"></div>
                <p className="mt-4 text-[#0D5F3F]">Cargando productos...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Grid de productos */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-gray-500">No hay productos disponibles en este momento.</p>
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
