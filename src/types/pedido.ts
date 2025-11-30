export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  ACEPTADO = 'ACEPTADO',
  RECOGIDO = 'RECOGIDO',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export interface Pago {
  id: string;
  monto: number;
  fechaPago: string;
  pedidoId: string;
  metodo: string;
}

export interface DetallePedido {
  id: string;
  cantidad: number;
  precioUnit: number;
  pedidoId: string;
  productoId: string;
  producto: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pedido {
  id: string;
  estado: EstadoPedido;
  total: number;
  fechaCreacion: string;
  userId: string;
  pago?: Pago;
  detallesPedido: DetallePedido[];
}

export interface CreatePedidoDto {
  userId: string;
  direccion: string;
}
