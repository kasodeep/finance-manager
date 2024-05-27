const { create } = require("zustand");

// managing the state of the app.
export const useNewCategory = create((set) => ({
   isOpen: false,
   onOpen: () => set({ isOpen: true }),
   onClose: () => set({ isOpen: false }),
}))
