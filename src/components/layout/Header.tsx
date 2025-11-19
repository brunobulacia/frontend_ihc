import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#FDF4D9]/95 backdrop-blur-sm border-b border-[#F5C842]/20 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
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
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/menu" className="text-[#0D5F3F] hover:text-[#0D5F3F]/80 font-medium transition-colors">
              Menú
            </Link>
            <Link href="/carrito" className="text-[#0D5F3F] hover:text-[#0D5F3F]/80 font-medium transition-colors">
              Carrito
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
