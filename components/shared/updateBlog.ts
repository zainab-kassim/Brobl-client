import { create } from 'zustand'

interface Author {
    username: string;
    _id: string;
}

interface Blog {
    author: Author;
    username: string;
    _id: string;
    text: string;
    img: string;
    likes: Likes[];

}

interface Likes {
    _id: string;
}

interface BlogsStore {
    blogs: Blog[]; // Array of Blog objects
    setBlogs: (value: Blog[]) => void; // Setter to update the entire blog list
    addBlog: (newBlog: Blog) => void; // Method to add a new blog
}


const useBlogsStore = create<BlogsStore>((set) => ({
    blogs: [], // Initialize blogs as an empty array
    setBlogs: (value: Blog[]) => set({ blogs: value }), // Update blogs with the given array
    addBlog: (newBlog: Blog) =>
        set((state) => ({ blogs: [...state.blogs, newBlog] })), // Add a new blog to the existing list
}));


export default useBlogsStore;