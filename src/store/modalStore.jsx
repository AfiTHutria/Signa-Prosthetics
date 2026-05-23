import { create } from 'zustand'

export const useModalStore = create((set) => ({
  modals: [],

  openModal: (type, props = {}) =>
    set((state) => ({
      modals: [...state.modals, { id: crypto.randomUUID(), type, props }],
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: id
        ? state.modals.filter((modal) => modal.id !== id)
        : state.modals.slice(0, -1),
    })),

  closeAllModals: () => set({ modals: [] }),
}))
