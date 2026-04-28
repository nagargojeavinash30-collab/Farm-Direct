import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[], totalPrice: number, totalItems: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalPrice: 0,
  totalItems: 0,

  addItem: (item: CartItem) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return {
        items: [...state.items, item],
      };
    });
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQuantity: (id: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => {
    set({ items: [], totalPrice: 0, totalItems: 0 });
  },

  setCart: (items: CartItem[], totalPrice: number, totalItems: number) => {
    set({ items, totalPrice, totalItems });
  },
}));
