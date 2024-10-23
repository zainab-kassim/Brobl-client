import { create } from 'zustand'




// Create the Zustand store
const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,

    setisLoggedIn: (value: boolean) => set(() => ({ isLoggedIn: value })),
}));

  
export default useAuthStore;
