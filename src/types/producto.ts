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

export interface ProductoCategoria {
  id: string;
  productoId: string;
  categoriaId: string;
  producto?: Producto;
  categoria?: Categoria;
  isActive: boolean;
}
