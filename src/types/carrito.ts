// Tipos base del backend
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  isActive: boolean;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  isActive: boolean;
}

export interface Carrito {
  id: string;
  userId: string;
  itemCarrito: ItemCarrito[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ItemCarrito {
  id: string;
  cantidad: number;
  productoId: string;
  producto?: Producto;
  carritoId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemCarritoDto {
  cantidad: number;
  productoId: string;
  carritoId: string;
}

export interface UpdateItemCarritoDto {
  cantidad?: number;
}

// Tipos extendidos para el frontend
export interface CartItem extends ItemCarrito {
  producto: Producto;
}

export interface CartState {
  items: CartItem[];
  total: number;
  carritoId: string | null;
}
