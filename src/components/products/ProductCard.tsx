import React from 'react';
import Image from 'next/image';
import { Producto } from '@/types/producto';

interface ProductCardProps {
  producto: Producto;
  onAddToCart: (producto: Producto) => void;
}

export function ProductCard({ producto, onAddToCart }: ProductCardProps) {
  const [cantidad, setCantidad] = React.useState(1);

  const handleIncrement = () => {
    if (cantidad < producto.stock) {
      setCantidad(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(producto);
    setCantidad(1);
  };

  return (
    <div className="bg-[var(--background)] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Imagen del producto */}
      <div className="relative h-40 sm:h-48 bg-[var(--background-gray-100)]">
        <Image
          src='/chicken-plate.jpg'
          alt={producto.nombre}
          fill
          className="object-cover"
        />
      </div>

      {/* Información del producto */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[var(--color-green-text)] line-clamp-1">
            {producto.nombre}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-orange-accent)] mt-1 line-clamp-2">
            {producto.descripcion}
          </p>
        </div>

        {/* Precio y controles */}
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <span className="font-bold text-lg sm:text-xl text-[#0D5F3F]">
            Bs. {producto.precio.toFixed(2)}
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Contador de cantidad */}
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-full px-1.5 sm:px-2 py-1">
              <button
                onClick={handleDecrement}
                className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#0D5F3F] hover:bg-gray-200 rounded-full transition-colors text-sm sm:text-base"
                disabled={cantidad <= 1}
              >
                -
              </button>
              <span className="w-5 sm:w-6 text-center font-medium text-[#0D5F3F] text-sm sm:text-base">
                {cantidad}
              </span>
              <button
                onClick={handleIncrement}
                className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#0D5F3F] hover:bg-gray-200 rounded-full transition-colors text-sm sm:text-base"
                disabled={cantidad >= producto.stock}
              >
                +
              </button>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0D5F3F] hover:bg-[#0D5F3F]/90 text-white rounded-full flex items-center justify-center transition-colors shadow-md active:scale-95"
              disabled={producto.stock === 0}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-5 sm:h-5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stock bajo aviso */}
        {producto.stock < 5 && producto.stock > 0 && (
          <p className="text-xs text-[#C85A2B]">Solo quedan {producto.stock} unidades</p>
        )}
        {producto.stock === 0 && (
          <p className="text-xs text-red-600 font-medium">Sin stock</p>
        )}
      </div>
    </div>
  );
}
