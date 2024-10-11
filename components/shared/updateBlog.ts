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
    blogs: Blog[]; // Use plural for clarity
    setBlogs: (value: Blog[]) => void; // Set the parameter type to Blog[]
}


const useBlogsStore = create<BlogsStore>((set) => ({
    blogs: [],
    setBlogs: (value: Blog[]) => set(() => ({ blogs: value })),
}));


export default useBlogsStore;