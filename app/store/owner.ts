import { create } from 'zustand';


// Create the Zustand store
const useOwnerStore = create<OwnerStore>((set) => ({
    BlogOwner: {}, // Initialize the blogs object with no states
    setBlogState: (blogId: string, value: boolean) =>
        set((state) => ({
            BlogOwner: {
                ...state.BlogOwner,
                [blogId]: value, // Set the boolean value for the given blog ID
            },
        })),
}));

export default useOwnerStore;
