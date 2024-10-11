import { create } from 'zustand';

// Define the type for the store's state and actions
interface FormState {
    showForm: boolean; // The boolean state for form visibility
    setShowForm: (value: boolean) => void; // Function to set the form visibility
}

// Create the Zustand store
const useFormStore = create<FormState>((set) => ({
    showForm: false,
    setShowForm: (value: boolean) => set({ showForm: value }),
}));

export default useFormStore;
