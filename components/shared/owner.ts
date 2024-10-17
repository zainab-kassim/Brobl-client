import { create } from 'zustand';

// Define the OwnerState type where each blog ID maps to a boolean
type OwnerState = {
    [key: string]: boolean; // Each blog ID will map to a boolean (true or false)
};

// Define the store interface
type OwnerStore = {
    BlogOwner: OwnerState; // Store blog IDs with their corresponding boolean values
    setBlogState: (blogId: string, value: boolean) => void; // Function to set the boolean state for a blog
};

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
