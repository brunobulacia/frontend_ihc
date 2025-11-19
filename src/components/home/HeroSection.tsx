import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#F5C842] to-[#F5C842]/90 rounded-3xl overflow-hidden shadow-xl">
      <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0D5F3F] leading-tight">
            Comida deliciosa
          </h2>
          <p className="text-[#C85A2B] text-xl font-semibold">
            al instante
          </p>
          <p className="text-[#0D5F3F]/80 text-lg leading-relaxed">
            Selecciona tu ubicación, ordena tu pedido desde nuestro menú y recíbelo en tu puerta 
            de la manera más rápida y fácil posible.
          </p>
          <Link href="/menu">
            <Button size="lg" className="shadow-lg">
              <span className="text-lg">→</span>
              Explorar el Menú
            </Button>
          </Link>
        </div>
        
        <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
          <Image
            src="/chicken-plate.jpg"
            alt="Plato de pollo con papas fritas"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
