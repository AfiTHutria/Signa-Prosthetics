import { create } from 'zustand'

export const usePrototypeAccessStore = create((set) => ({
  isOpen: false,
  step: 'choose',
  open: () => set({ isOpen: true, step: 'choose' }),
  close: () => set({ isOpen: false, step: 'choose' }),
  setStep: (step) => set({ step }),
}))
