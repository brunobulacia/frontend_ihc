'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface PagoStepProps {
  onComplete: () => void;
  onBack: () => void;
  direccion: string;
  total: number;
  envio: number;
}

export function PagoStep({ onComplete, onBack, direccion, total, envio }: PagoStepProps) {
  const [pagado, setPagado] = useState(false);

  const totalFinal = total + envio;

  // QR generado con el monto (en producción, generarías uno real con pasarela de pago)
  const qrData = `CambaEats-Pago-${totalFinal.toFixed(2)}-${Date.now()}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="text-[var(--color-orange-accent)] hover:text-[var(--color-orange-hover)] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-green-text)] text-center">
        QR generado para el pago del pedido
      </h2>

      {/* Información de la dirección */}
      <div className="bg-[var(--background-gray-50)] rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📍</div>
          <div className="flex-1">
            <div className="font-semibold text-[var(--color-green-text)]">Dirección de envío:</div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{direccion}</div>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center py-8">
        <div className="bg-[var(--background)] p-6 rounded-2xl shadow-lg">
          {/* QR Code placeholder - En producción usarías una librería como qrcode.react */}
          <div className="w-64 h-64 bg-[var(--background-gray-100)] rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Patrón de QR simulado */}
            <div className="absolute inset-0 grid grid-cols-8 gap-1 p-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`${
                    Math.random() > 0.5 ? 'bg-[var(--color-green-text)]' : 'bg-transparent'
                  } rounded-sm`}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-[var(--text-secondary)] mt-3">
            Escanea este código QR para pagar
          </p>
        </div>
      </div>

      {/* Resumen de pago */}
      <div className="bg-[var(--background-gray-50)] rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Subtotal:</span>
          <span className="font-medium text-[var(--color-green-text)]">Bs. {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Envío:</span>
          <span className="font-medium text-[var(--color-green-text)]">Bs. {envio.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-[var(--border-gray-200)]">
          <span className="text-[var(--color-green-text)]">Total a pagar:</span>
          <span className="text-[var(--color-orange-accent)]">Bs. {totalFinal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkbox de confirmación */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={pagado}
          onChange={(e) => setPagado(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-[var(--border-gray-200)] text-[var(--color-green-text)] focus:ring-[var(--color-green-text)]"
        />
        <span className="text-sm text-[var(--text-secondary)]">
          He realizado el pago y confirmo que la transacción fue exitosa
        </span>
      </label>

      {/* Botón continuar */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onComplete}
        disabled={!pagado}
      >
        Ya realicé el pago →
      </Button>
    </div>
  );
}
