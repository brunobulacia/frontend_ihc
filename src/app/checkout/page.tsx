'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useCartStore } from '@/lib/store/cartStore';
import { DireccionStep } from '@/components/checkout/DireccionStep';
import { PagoStep } from '@/components/checkout/PagoStep';
import { ResumenStep } from '@/components/checkout/ResumenStep';

type Step = 'direccion' | 'pago' | 'resumen';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const [currentStep, setCurrentStep] = useState<Step>('direccion');
  const [direccion, setDireccion] = useState<string>('');
  const [savedItems, setSavedItems] = useState(items);

  // Si el carrito está vacío Y no estamos en el paso de resumen, redirigir al menú
  useEffect(() => {
    if (items.length === 0 && currentStep !== 'resumen') {
      router.push('/menu');
    }
  }, [items, currentStep, router]);

  // Guardar items cuando pasamos al paso de pago
  useEffect(() => {
    if (currentStep === 'pago' && items.length > 0) {
      setSavedItems(items);
    }
  }, [currentStep, items]);

  const total = getTotal();
  const envio = 5;

  const handleDireccionComplete = (selectedDireccion: string) => {
    setDireccion(selectedDireccion);
    setCurrentStep('pago');
  };

  const handlePagoComplete = () => {
    setCurrentStep('resumen');
  };

  const handleVolverMenu = () => {
    router.push('/menu');
  };

  return (
    <div className="min-h-screen bg-[var(--background-gray)]">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        {/* Botón regresar */}
        <button
          onClick={() => router.push('/menu')}
          className="flex items-center gap-2 text-[var(--color-orange-accent)] hover:text-[var(--color-orange-hover)] mb-6 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Regresar al Menú</span>
        </button>

        {/* Card principal */}
        <div className="bg-[var(--background)] rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            {/* Paso 1: Dirección */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[var(--text-white)] ${
                currentStep === 'direccion' 
                  ? 'bg-[var(--color-green-text)]' 
                  : 'bg-[var(--background-gray-200)]'
              }`}>
                1
              </div>
              <span className="text-xs mt-2 font-medium text-[var(--color-green-text)]">Dirección</span>
            </div>

            <div className="h-0.5 bg-[var(--background-gray-200)] flex-1 mx-2" />

            {/* Paso 2: Pago */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[var(--text-white)] ${
                currentStep === 'pago' 
                  ? 'bg-[var(--color-green-text)]' 
                  : currentStep === 'resumen'
                  ? 'bg-[var(--color-green-text)]'
                  : 'bg-[var(--background-gray-200)]'
              }`}>
                2
              </div>
              <span className="text-xs mt-2 font-medium text-[var(--color-green-text)]">Pago</span>
            </div>

            <div className="h-0.5 bg-[var(--background-gray-200)] flex-1 mx-2" />

            {/* Paso 3: Resumen */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[var(--text-white)] ${
                currentStep === 'resumen' 
                  ? 'bg-[var(--color-green-text)]' 
                  : 'bg-[var(--background-gray-200)]'
              }`}>
                3
              </div>
              <span className="text-xs mt-2 font-medium text-[var(--color-green-text)]">Resumen</span>
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="mt-8">
            {currentStep === 'direccion' && (
              <DireccionStep 
                onComplete={handleDireccionComplete}
                total={total}
                envio={envio}
              />
            )}
            
            {currentStep === 'pago' && (
              <PagoStep 
                onComplete={handlePagoComplete}
                onBack={() => setCurrentStep('direccion')}
                direccion={direccion}
                total={total}
                envio={envio}
              />
            )}
            
            {currentStep === 'resumen' && (
              <ResumenStep 
                direccion={direccion}
                items={savedItems}
                total={total}
                envio={envio}
                onVolverMenu={handleVolverMenu}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
