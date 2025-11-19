import React from 'react';
import Image from 'next/image';
import { Producto } from '@/types/producto';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  producto: Producto;
  onAddToCart: (producto: Producto) => void;
}

export function ProductCard({ producto, onAddToCart }: ProductCardProps) {
  const [cantidad, setCantidad] = React.useState(1);
  const [imgSrc, setImgSrc] = React.useState(`/productos/${producto.id}.jpg`);
  const [imgError, setImgError] = React.useState(false);

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
    setCantidad(1); // Reset después de agregar
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Imagen del producto */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={imgError ? '/chicken-plate.jpg' : imgSrc}
          alt={producto.nombre}
          fill
          className="object-cover"
          onError={() => {
            if (!imgError) {
              setImgError(true);
            }
          }}
        />
      </div>

      {/* Información del producto */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-[#0D5F3F] line-clamp-1">
            {producto.nombre}
          </h3>
          <p className="text-sm text-[#C85A2B] mt-1 line-clamp-2">
            {producto.descripcion}
          </p>
        </div>

        {/* Precio y controles */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-xl text-[#0D5F3F]">
            Bs. {producto.precio.toFixed(2)}
          </span>

          <div className="flex items-center gap-3">
            {/* Contador de cantidad */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 flex items-center justify-center text-[#0D5F3F] hover:bg-gray-200 rounded-full transition-colors"
                disabled={cantidad <= 1}
              >
                -
              </button>
              <span className="w-6 text-center font-medium text-[#0D5F3F]">
                {cantidad}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center text-[#0D5F3F] hover:bg-gray-200 rounded-full transition-colors"
                disabled={cantidad >= producto.stock}
              >
                +
              </button>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-[#0D5F3F] hover:bg-[#0D5F3F]/90 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
              disabled={producto.stock === 0}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
