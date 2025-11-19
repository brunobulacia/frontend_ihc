'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface DireccionStepProps {
  onComplete: (direccion: string) => void;
  total: number;
  envio: number;
}

export function DireccionStep({ onComplete, total, envio }: DireccionStepProps) {
  const [selectedMode, setSelectedMode] = useState<'mapa' | 'recientes' | null>(null);
  const [direccionTexto, setDireccionTexto] = useState('');

  // Direcciones recientes de ejemplo (podrías cargarlas del localStorage o backend)
  const direccionesRecientes = [
    { id: 1, nombre: 'Casa', direccion: 'Av. Banzer #1234, Santa Cruz' },
    { id: 2, nombre: 'Trabajo', direccion: 'Calle 21 de Mayo #567, Santa Cruz' },
  ];

  const handleSubmit = () => {
    if (selectedMode === 'mapa' && direccionTexto) {
      onComplete(direccionTexto);
    } else if (selectedMode === 'recientes' && direccionTexto) {
      onComplete(direccionTexto);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-green-text)] text-center">
        Selecciona la dirección de envío
      </h2>

      {/* Selector de modo */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedMode('mapa')}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedMode === 'mapa'
              ? 'border-[var(--color-green-text)] bg-[var(--color-green-text)]/5'
              : 'border-[var(--border-gray-200)] hover:border-[var(--color-green-text)]/50'
          }`}
        >
          <div className="text-3xl mb-2">📍</div>
          <div className="font-semibold text-[var(--color-green-text)]">Mapa</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            Selecciona en el mapa
          </div>
        </button>

        <button
          onClick={() => setSelectedMode('recientes')}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedMode === 'recientes'
              ? 'border-[var(--color-green-text)] bg-[var(--color-green-text)]/5'
              : 'border-[var(--border-gray-200)] hover:border-[var(--color-green-text)]/50'
          }`}
        >
          <div className="text-3xl mb-2">🏠</div>
          <div className="font-semibold text-[var(--color-green-text)]">Recientes</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            Direcciones guardadas
          </div>
        </button>
      </div>

      {/* Contenido según modo seleccionado */}
      {selectedMode === 'mapa' && (
        <div className="space-y-4">
          {/* Mapa placeholder */}
          <div className="bg-[var(--background-gray-100)] rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-50" />
            <div className="relative text-center">
              <div className="text-6xl mb-2">🗺️</div>
              <p className="text-[var(--text-secondary)] font-medium">
                Mapa interactivo
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                (Integración con Google Maps próximamente)
              </p>
            </div>
          </div>

          {/* Input de dirección */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-green-text)] mb-2">
              Dirección seleccionada:
            </label>
            <input
              type="text"
              value={direccionTexto}
              onChange={(e) => setDireccionTexto(e.target.value)}
              placeholder="Ej: Av. Banzer #1234, Santa Cruz de la Sierra"
              className="w-full px-4 py-3 border border-[var(--border-gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-green-text)] text-[var(--foreground)]"
            />
          </div>
        </div>
      )}

      {selectedMode === 'recientes' && (
        <div className="space-y-3">
          {direccionesRecientes.map((dir) => (
            <button
              key={dir.id}
              onClick={() => setDireccionTexto(dir.direccion)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                direccionTexto === dir.direccion
                  ? 'border-[var(--color-green-text)] bg-[var(--color-green-text)]/5'
                  : 'border-[var(--border-gray-200)] hover:border-[var(--color-green-text)]/50'
              }`}
            >
              <div className="font-semibold text-[var(--color-green-text)]">{dir.nombre}</div>
              <div className="text-sm text-[var(--text-secondary)] mt-1">{dir.direccion}</div>
            </button>
          ))}

          {/* Nueva dirección */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-[var(--color-green-text)] mb-2">
              O ingresa una nueva dirección:
            </label>
            <input
              type="text"
              value={direccionTexto}
              onChange={(e) => setDireccionTexto(e.target.value)}
              placeholder="Ej: Av. Banzer #1234, Santa Cruz de la Sierra"
              className="w-full px-4 py-3 border border-[var(--border-gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-green-text)] text-[var(--foreground)]"
            />
          </div>
        </div>
      )}

      {/* Resumen de costos */}
      {selectedMode && (
        <div className="bg-[var(--background-gray-50)] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Subtotal:</span>
            <span className="font-medium text-[var(--color-green-text)]">Bs. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Envío:</span>
            <span className="font-medium text-[var(--color-green-text)]">Bs. {envio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--border-gray-200)]">
            <span className="text-[var(--color-green-text)]">Total:</span>
            <span className="text-[var(--color-orange-accent)]">Bs. {(total + envio).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Botón continuar */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={!direccionTexto}
      >
        Continuar al pago →
      </Button>
    </div>
  );
}
