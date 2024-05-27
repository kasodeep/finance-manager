const { create } = require("zustand");

// managing the state of the app.
export const useOpenCategory = create((set) => ({
   id: undefined,
   isOpen: false,
   onOpen: (id) => set({ isOpen: true, id }),
   onClose: () => set({ isOpen: false, id: undefined }),
}))
