import { create } from 'zustand'


// Define the type for the store's state and actions
interface AuthState {
    isLoggedIn: boolean; // The boolean state
    setisLoggedIn: (value: boolean) => void; // The function to update the state
}



// Create the Zustand store
const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,

    setisLoggedIn: (value: boolean) => set(() => ({ isLoggedIn: value })),
}));

  
export default useAuthStore;
