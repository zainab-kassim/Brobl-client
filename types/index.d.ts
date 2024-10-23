type ColorState = {
    [key: string]: boolean; // Each blog ID will map to a boolean indicating like state
};


interface Author {
    username: string;
    _id: string;
}



interface userBlogs {
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



interface EachBlog {
    author: { username: string };
    _id: string;
    likes: (string | null)[];
}


// Define the type for the store's state and actions
interface AuthState {
    isLoggedIn: boolean; // The boolean state
    setisLoggedIn: (value: boolean) => void; // The function to update the state
}


// Define the OwnerState type where each blog ID maps to a boolean
type OwnerState = {
    [key: string]: boolean; // Each blog ID will map to a boolean (true or false)
};

// Define the store interface
type OwnerStore = {
    BlogOwner: OwnerState; // Store blog IDs with their corresponding boolean values
    setBlogState: (blogId: string, value: boolean) => void; // Function to set the boolean state for a blog
};


interface Blog {
    author: Author;
    username: string;
    _id: string;
    text: string;
    img: string;
    likes: Likes[];
    comments: Comment[];
}


interface BlogsStore {
    blogs: Blog[]; // Array of Blog objects
    setBlogs: (value: Blog[]) => void; // Setter to update the entire blog list
    addBlog: (newBlog: Blog) => void; // Method to add a new blog
}

// Define the type for the store's state and actions
interface FormState {
    showForm: boolean; // The boolean state for form visibility
    setShowForm: (value: boolean) => void; // Function to set the form visibility
}

interface Comment {
    author: { username: string,_id:string };
    _id: string;
    text: string;
  }



