import { create } from 'zustand';

export const useCart = create((set, get) => ({
    items: [],

    addItem: (product, customization) => {
        const newItem = {
            id: `${product.id}-${Date.now()}`,
            product,
            ...customization,
            quantity: customization.quantity || 1
        };
        set((state) => ({ items: [...state.items, newItem] }));
    },

    removeItem: (itemId) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== itemId)
        }));
    },

    updateQuantity: (itemId, quantity) => {
        set((state) => ({
            items: state.items.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        }));
    },

    clearCart: () => set({ items: [] }),

    getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
            const itemBase = item.product.base_price * item.quantity;
            const addonsPrice = (item.addons || []).reduce((sum, addon) => sum + (addon.extra_price * item.quantity), 0);
            return total + itemBase + addonsPrice;
        }, 0);
    }
}));
