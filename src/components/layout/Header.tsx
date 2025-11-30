'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';

export function Header() {
  const { items, toggleSidebar } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <header className="fixed top-0 left-0 right-0 bg-[var(--color-header-bg)]/95 backdrop-blur-sm border-b border-[var(--color-yellow-primary)]/20 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/menu" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden relative">
              <Image 
                src="/logo-icon.jpg" 
                alt="CambaEats Logo" 
                width={40} 
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#0D5F3F]">CambaEats</h1>
              <p className="text-xs text-[#C85A2B] font-medium">al instante</p>
            </div>
          </Link>

          {/* Navegación derecha */}
          <div className="flex items-center gap-4">
            {/* Botón Mis Pedidos */}
            <Link 
              href="/pedidos"
              className="flex items-center gap-2 text-[var(--color-orange-accent)] hover:text-[var(--color-orange-hover)] transition-colors"
              aria-label="Mis Pedidos"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>

            {/* Botón Carrito con badge */}
            <button
              onClick={toggleSidebar}
              className="relative flex items-center gap-2 text-[var(--color-orange-accent)] hover:text-[var(--color-orange-hover)] transition-colors"
              aria-label="Carrito de compras"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-orange-accent)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
