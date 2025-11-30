'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';

function CartButtonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const handleClick = () => {
    router.push(`/carrito?userId=${userId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 lg:hidden bg-[#C85A2B] hover:bg-[#B54E23] text-white rounded-full p-4 shadow-lg transition-all z-[60] flex items-center justify-center"
    >
      <svg
        width="24"
        height="24"
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
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[var(--color-green-text)] text-[var(--text-white)] text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}

export function CartButton() {
  return (
    <Suspense fallback={null}>
      <CartButtonContent />
    </Suspense>
  );
}
