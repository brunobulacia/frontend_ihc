import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Producto } from '@/types/carrito';
import { carritosApi, itemsCarritoApi, productosApi } from '@/lib/api/client';
import { remoteLog } from '@/lib/utils/remoteLog';

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
          
          remoteLog.info('🔵 CartStore.initCarrito - Iniciando', { 
            userId,
            currentCarritoId: get().carritoId 
          });
          
          // SIEMPRE buscar el carrito actual del usuario en el backend
          // Esto asegura que después de limpiar el carrito, obtengamos uno nuevo
          const carrito = await carritosApi.findOrCreateByUserId(userId);
          
          remoteLog.info('✅ CartStore - Carrito obtenido/creado', { 
            carritoId: carrito.id,
            hadPreviousId: !!get().carritoId
          });
          
          // Verificar que itemCarrito existe y es un array
          if (carrito && Array.isArray(carrito.itemCarrito)) {
            // Filtrar solo los items activos
            const itemsActivos = carrito.itemCarrito.filter((item) => item.isActive);
            
            if (itemsActivos.length > 0) {
              const itemsWithProducts = await Promise.all(
                itemsActivos.map(async (item) => ({
                  ...item,
                  producto: await productosApi.getById(item.productoId),
                }))
              );
              set({ carritoId: carrito.id, items: itemsWithProducts });
              remoteLog.info('CartStore - Items cargados', { itemsCount: itemsWithProducts.length });
            } else {
              set({ carritoId: carrito.id, items: [] });
              remoteLog.info('CartStore - Carrito vacío (sin items activos)');
            }
          } else {
            set({ carritoId: carrito.id, items: [] });
            remoteLog.info('CartStore - Carrito vacío (sin itemCarrito)');
          }
        } catch (error) {
          remoteLog.error('❌ CartStore - Error inicializando', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
          // En caso de error, crear un carrito local temporal
          const tempCarritoId = `temp-${Date.now()}`;
          set({ carritoId: tempCarritoId, items: [] });
          remoteLog.warn('⚠️ CartStore - Carrito temporal creado', { carritoId: tempCarritoId });
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (producto: Producto, cantidad = 1) => {
        try {
          const { items, carritoId } = get();
          
          if (!carritoId) {
            remoteLog.error('CartStore.addItem - Carrito no inicializado', { productoId: producto.id });
            throw new Error('Carrito no inicializado');
          }

          remoteLog.info('🔵 CartStore.addItem - Agregando producto', {
            productoId: producto.id,
            cantidad,
            carritoId
          });

          // Verificar si el producto ya existe en el carrito
          const existingItem = items.find(item => item.productoId === producto.id);

          if (existingItem) {
            remoteLog.info('CartStore - Producto ya existe, actualizando cantidad', {
              itemId: existingItem.id
            });
            // Actualizar cantidad
            await get().updateItemQuantity(existingItem.id, existingItem.cantidad + cantidad);
          } else {
            // Si es un carrito temporal (offline), agregar localmente
            if (carritoId.startsWith('temp-')) {
              console.log('⚠️ Modo OFFLINE: agregando item localmente');
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
              console.log('✅ Item agregado localmente (modo offline)');
            } else {
              console.log('🔵 Creando item en backend...');
              // Crear nuevo item en el backend
              const newItem = await itemsCarritoApi.create({
                carritoId,
                productoId: producto.id,
                cantidad,
              });

              set({
                items: [...items, { ...newItem, producto }],
              });
              console.log('✅ Item agregado correctamente:', newItem.id);
            }
          }
        } catch (error) {
          console.error('❌ Error agregando item:', error);
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
          const { carritoId } = get();
          if (!carritoId) return;

          // Limpiar estado local Y eliminar el carritoId para forzar la creación de uno nuevo
          set({ items: [], carritoId: null });
          if (carritoId.startsWith('temp-')) {
            console.log('Carrito temporal eliminado');
          } else {
            console.log('Carrito limpiado y carritoId eliminado (se creará uno nuevo en el próximo pedido)');
          }
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
