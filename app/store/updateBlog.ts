import { create } from 'zustand'


const useBlogsStore = create<BlogsStore>((set) => ({
    blogs: [], // Initialize blogs as an empty array
    setBlogs: (value: Blog[]) => set({ blogs: value }), // Update blogs with the given array
    addBlog: (newBlog: Blog) =>
        set((state) => ({ blogs: [...state.blogs, newBlog] })), // Add a new blog to the existing list
}));


export default useBlogsStore;