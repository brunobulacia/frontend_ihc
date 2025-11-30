import { Producto, Categoria } from '@/types/producto';
import { Carrito, ItemCarrito, CreateItemCarritoDto, UpdateItemCarritoDto } from '@/types/carrito';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Helper para manejar errores
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error en la petición');
  }

  const text = await response.text();
  if (!text || text.trim() === '') {
    return {} as T;
  }
  
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error('Error parseando JSON:', text);
    throw new Error('Respuesta inválida del servidor');
  }
}

// ============== PRODUCTOS ==============
export const productosApi = {
  getAll: async (): Promise<Producto[]> => {
    const response = await fetch(`${API_URL}/productos`);
    return handleResponse<Producto[]>(response);
  },

  getById: async (id: string): Promise<Producto> => {
    const response = await fetch(`${API_URL}/productos/${id}`);
    return handleResponse<Producto>(response);
  },

  create: async (data: Omit<Producto, 'id'>): Promise<Producto> => {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Producto>(response);
  },
};

// ============== CATEGORÍAS ==============
export const categoriasApi = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await fetch(`${API_URL}/categorias`);
    return handleResponse<Categoria[]>(response);
  },
};

// ============== CARRITOS ==============
export const carritosApi = {
  findOrCreateByUserId: async (userId: string): Promise<Carrito> => {
    const response = await fetch(`${API_URL}/carritos/user/${userId}`);
    return handleResponse<Carrito>(response);
  },

  create: async (userId: string): Promise<Carrito> => {
    const response = await fetch(`${API_URL}/carritos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return handleResponse<Carrito>(response);
  },

  getById: async (id: string): Promise<Carrito> => {
    const response = await fetch(`${API_URL}/carritos/${id}`);
    return handleResponse<Carrito>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/carritos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

// ============== ITEMS CARRITO ==============
export const itemsCarritoApi = {
  create: async (data: CreateItemCarritoDto): Promise<ItemCarrito> => {
    const response = await fetch(`${API_URL}/items-carrito`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ItemCarrito>(response);
  },

  update: async (id: string, data: UpdateItemCarritoDto): Promise<ItemCarrito> => {
    const response = await fetch(`${API_URL}/items-carrito/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ItemCarrito>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/items-carrito/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  getByCarritoId: async (carritoId: string): Promise<ItemCarrito[]> => {
    const response = await fetch(`${API_URL}/items-carrito?carritoId=${carritoId}`);
    return handleResponse<ItemCarrito[]>(response);
  },
};

// ============== CLIENTE GENÉRICO ==============
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`);
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse<T>(response);
  },
};
