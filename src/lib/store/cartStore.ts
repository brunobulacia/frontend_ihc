import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Producto } from '@/types/carrito';
import { carritosApi, itemsCarritoApi, productosApi } from '@/lib/api/client';

interface CartStore {
  items: CartItem[];
  carritoId: string | null;
  isOpen: boolean;
  isLoading: boolean;
  
  // Acciones
  initCarrito: (userId: string) => Promise<void>;
  addItem: (producto: Producto, cantidad?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, cantidad: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleSidebar: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      carritoId: null,
      isOpen: false,
      isLoading: false,

      initCarrito: async (userId: string) => {
        try {
          set({ isLoading: true });
          const carritoId = get().carritoId;
          
          // Si no hay carrito, crear uno nuevo
          if (!carritoId) {
            const carrito = await carritosApi.create(userId);
            set({ carritoId: carrito.id, items: [] });
            console.log('Carrito creado:', carrito.id);
          } else {
            // Cargar items del carrito existente
            try {
              const carrito = await carritosApi.getById(carritoId);
              
              // Verificar que itemCarrito existe y es un array
              if (carrito && Array.isArray(carrito.itemCarrito)) {
                const itemsWithProducts = await Promise.all(
                  carrito.itemCarrito.map(async (item) => ({
                    ...item,
                    producto: await productosApi.getById(item.productoId),
                  }))
                );
                set({ items: itemsWithProducts });
                console.log('Carrito cargado:', carritoId);
              } else {
                // Si el carrito no tiene items o es inválido, iniciar vacío
                set({ items: [] });
                console.log('Carrito sin items:', carritoId);
              }
            } catch (loadError) {
              console.error('Error cargando carrito existente, creando uno nuevo:', loadError);
              // Si falla cargar el carrito, crear uno nuevo
              const carrito = await carritosApi.create(userId);
              set({ carritoId: carrito.id, items: [] });
            }
          }
        } catch (error) {
          console.error('Error inicializando carrito:', error);
          // En caso de error, crear un carrito local temporal
          const tempCarritoId = `temp-${Date.now()}`;
          set({ carritoId: tempCarritoId, items: [] });
          console.log('Carrito temporal creado:', tempCarritoId);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (producto: Producto, cantidad = 1) => {
        try {
          const { items, carritoId } = get();
          
          if (!carritoId) {
            throw new Error('Carrito no inicializado');
          }

          // Verificar si el producto ya existe en el carrito
          const existingItem = items.find(item => item.productoId === producto.id);

          if (existingItem) {
            // Actualizar cantidad
            await get().updateItemQuantity(existingItem.id, existingItem.cantidad + cantidad);
          } else {
            // Si es un carrito temporal (offline), agregar localmente
            if (carritoId.startsWith('temp-')) {
              const tempItem: CartItem = {
                id: `temp-item-${Date.now()}`,
                carritoId,
                productoId: producto.id,
                cantidad,
                producto,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              set({ items: [...items, tempItem] });
              console.log('Item agregado localmente (modo offline)');
            } else {
              // Crear nuevo item en el backend
              const newItem = await itemsCarritoApi.create({
                carritoId,
                productoId: producto.id,
                cantidad,
              });

              set({
                items: [...items, { ...newItem, producto }],
              });
            }
          }
        } catch (error) {
          console.error('Error agregando item:', error);
          throw error;
        }
      },

      removeItem: async (itemId: string) => {
        try {
          const { carritoId } = get();
          
          // Si es un item temporal (modo offline), solo actualizar estado local
          if (itemId.startsWith('temp-') || carritoId?.startsWith('temp-')) {
            set({ items: get().items.filter(item => item.id !== itemId) });
            console.log('Item eliminado localmente (modo offline)');
            return;
          }
          
          // Si es un item real, eliminar del backend
          await itemsCarritoApi.delete(itemId);
          set({ items: get().items.filter(item => item.id !== itemId) });
        } catch (error) {
          console.error('Error eliminando item:', error);
          throw error;
        }
      },

      updateItemQuantity: async (itemId: string, cantidad: number) => {
        try {
          if (cantidad <= 0) {
            await get().removeItem(itemId);
            return;
          }

          const { carritoId } = get();
          
          // Si es un item temporal (modo offline), solo actualizar estado local
          if (itemId.startsWith('temp-') || carritoId?.startsWith('temp-')) {
            set({
              items: get().items.map(item =>
                item.id === itemId ? { ...item, cantidad } : item
              ),
            });
            console.log('Cantidad actualizada localmente (modo offline)');
            return;
          }

          // Si es un item real, actualizar en el backend
          await itemsCarritoApi.update(itemId, { cantidad });
          set({
            items: get().items.map(item =>
              item.id === itemId ? { ...item, cantidad } : item
            ),
          });
        } catch (error) {
          console.error('Error actualizando cantidad:', error);
          throw error;
        }
      },

      clearCart: async () => {
        try {
          const { carritoId, items } = get();
          if (!carritoId) return;

          // Si es un carrito temporal (modo offline), solo limpiar estado local
          if (carritoId.startsWith('temp-')) {
            set({ items: [] });
            console.log('Carrito limpiado localmente (modo offline)');
            return;
          }

          // Si es un carrito real, eliminar todos los items del backend
          await Promise.all(
            items
              .filter(item => !item.id.startsWith('temp-'))  // Filtrar items temporales
              .map(item => itemsCarritoApi.delete(item.id))
          );
          set({ items: [] });
        } catch (error) {
          console.error('Error limpiando carrito:', error);
          throw error;
        }
      },

      toggleSidebar: () => {
        set({ isOpen: !get().isOpen });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.producto.precio * item.cantidad);
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ carritoId: state.carritoId }),
    }
  )
);
