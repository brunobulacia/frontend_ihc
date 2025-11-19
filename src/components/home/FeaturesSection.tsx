import React from 'react';
import { Card } from '@/components/ui/Card';
import { FEATURES } from '@/constants/config';

const iconMap = {
  shield: '🛡️',
  clock: '⏰',
  delivery: '🚚',
};

const colorVariants = {
  green: 'green' as const,
  yellow: 'yellow' as const,
  red: 'red' as const,
};

export function FeaturesSection() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center text-[#0D5F3F] mb-4">
        ¿Por qué elegirnos?
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {FEATURES.map((feature) => (
          <Card key={feature.id} variant={colorVariants[feature.color]}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-4xl shadow-md">
                {iconMap[feature.icon]}
              </div>
              <h3 className="text-xl font-bold text-[#0D5F3F]">
                {feature.title}
              </h3>
              <p className="text-[#0D5F3F]/70">
                {feature.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
