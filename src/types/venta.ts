export enum EstadoVenta {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  FALLIDO = 'FALLIDO',
}

export enum Metodo {
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  EFECTIVO = 'EFECTIVO',
  QR = 'QR',
}

export interface MetodoPago {
  id: string;
  proveedor: string;
  detalles: string;
  metodo: Metodo;
  isActive: boolean;
}

export interface Pago {
  id: string;
  estado: EstadoPago;
  monto: number;
  fechaPago: string;
  metodoPago: MetodoPago;
  ventaId: string;
  metodoPagoId: string;
  isActive: boolean;
}

export interface DetalleVenta {
  id: string;
  cantidad: number;
  precioUnit: number;
  ventaId: string;
  productoId: string;
  producto: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Venta {
  id: string;
  estado: EstadoVenta;
  total: number;
  fechaVenta: string;
  userId: string;
  isActive: boolean;
  pago?: Pago;
  detalleVentas: DetalleVenta[];
}

export interface CreateVentaDto {
  userId: string;
  items: Array<{
    productoId: string;
    cantidad: number;
    precioUnit: number;
  }>;
  direccion: string;
  metodoPagoId?: string;
}
