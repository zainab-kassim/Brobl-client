import { create } from 'zustand';


// Create the Zustand store
const useFormStore = create<FormState>((set) => ({
    showForm: false,
    setShowForm: (value: boolean) => set({ showForm: value }),
}));

export default useFormStore;
