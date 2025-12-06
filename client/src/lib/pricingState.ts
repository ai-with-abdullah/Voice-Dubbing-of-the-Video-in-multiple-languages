import { create } from 'zustand';

interface PricingState {
  isOpen: boolean;
  openPricing: () => void;
  closePricing: () => void;
  togglePricing: () => void;
}

export const usePricingStore = create<PricingState>((set) => ({
  isOpen: false,
  openPricing: () => set({ isOpen: true }),
  closePricing: () => set({ isOpen: false }),
  togglePricing: () => set((state) => ({ isOpen: !state.isOpen })),
}));
