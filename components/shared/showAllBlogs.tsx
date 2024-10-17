'use client'
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BookLockIcon, BookmarkIcon, EllipsisIcon, HeartIcon } from 'lucide-react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import Loader from '../ui/loader'
import { SkeletonCard } from './skeletoncard';
import Link from 'next/link'
import Image from 'next/image'
import profilePic from '../../public/man.png'
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import useBlogsStore from './updateBlog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




export default function showAllBlogs() {
    type ColorState = {
        [key: string]: boolean; // Each blog ID will map to a boolean indicating like state
    };

    const { blogs, setBlogs } = useBlogsStore(); // Get the blogs and setBlogs from the store
    const [loading, setLoading] = useState(true); // Add loading state
    const [isTruncated, setIsTruncated] = useState(true); // State for truncation
    const maxLength = 135; // The maximum length before 
    const [color, setColor] = useState<ColorState>({});
    const [isOwner, setisOwner] = useState(false);
    const router = useRouter();
    const { toast } = useToast();



    const toggleTruncation = () => {
        setIsTruncated(!isTruncated); // Toggle between truncated and full text
    };


    function isTokenValid() {
        const token = localStorage.getItem('token');
        // If there's no token, call handleBlogs and return
        if (!token) {
            handleBlogs();
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();
            const validation = currentTime <= expirationTime
            if (validation === false) {
                console.log('timed out')
                toast({
                    description: "Session timed out"
                })
                router.push('/sign-in')

            } else {
                handleBlogs()
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    }



    async function handleBlogs() {
        try {

            const res = await axios.get('https://brobl-server.vercel.app/api/blog/show');
            const { foundBlogs } = res.data
            const username = localStorage.getItem('username')

            // Check each blog for likes
            const updatedColor: ColorState = {};

            foundBlogs.forEach((blog: { _id: string; likes: (string | null)[] }) => {
                updatedColor[blog._id] = blog.likes.includes(username); // Set true or false based on likes
            })
            if (username === foundBlogs.author.username) {
                setisOwner(true)
            }

            setBlogs(foundBlogs)
            setColor(updatedColor)
        } catch (error) {
            toast({
                description: "error fetching blogs"
            })
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false); // Set loading to false when data is fetched or an error occurs
        }
    }


    useEffect(() => {
        isTokenValid()
    }, []);

    if (loading) {
        return <Loader /> // Show loader while data is being fetched
    }

    async function handleLikeClick(blogId: string) {
        try {
            const username = localStorage.getItem('username')
            const token = localStorage.getItem('token')
            const headers = createAuthHeaders(token)

            if (username && token) {

                const response = await axios.post(`https://brobl-server.vercel.app/api/blog/${blogId}/like`, {
                }, { headers })

                toast({
                    description: response.data.message
                })
                setColor(prev => ({ ...prev, [blogId]: !prev[blogId] })); // Toggle the like state

                handleBlogs()
            } else {
                toast({
                    description: 'sign in to continue'
                })
                router.push('/sign-in')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteBlog(blogId: string) {
        try {
            const username = localStorage.getItem('username')
            const token = localStorage.getItem('token')
            const headers = createAuthHeaders(token)
            if (username && token) {
                const response = await axios.delete(`https://brobl-server.vercel.app/api/blog/${blogId}/delete`,
                    { headers })
                const { message } = response.data
                toast({
                    description: message
                })
                handleBlogs()
            }
        } catch (error) {
            console.log(error)
        }
    }

    function createAuthHeaders(token: string | null) {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

    }





    return (
        <>
            {blogs.map((blog) => (
                <div key={blog._id}>
                    <li className="flex p-4 my-2  cursor-pointer">
                        <div className="flex flex-col flex-grow mx-2 xl:ml-28 xl:mr-96 lg:mx-32 md:mx-40 sm:mx-20">
                            <div className="flex items-center  justify-between mb-1 ">
                                <div className="flex items-center mb-1">
                                    <Image
                                        src={profilePic}
                                        alt="profilepic"
                                        width={100}
                                        height={100}
                                        className="w-8 h-8 rounded-full mr-2"
                                        quality={100}
                                        priority
                                    />
                                    <Link href={`/profile/${blog.author.username}`} >
                                        <p>
                                            <span className="hover:underline text-white font-semibold text-lg">{blog.author.username} </span>
                                        </p>
                                    </Link>
                                </div>
                                {isOwner && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 inline-flex" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <button onClick={()=>handleDeleteBlog(blog._id)}>
                                                <p className=' font-base px-1'>Delete</p>
                                            </button>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>

                            {blog.img ? (
                                <Link href={`/blog/${blog._id}/comments`} >
                                    <Image
                                        alt="blog-image"
                                        src={blog.img}
                                        width={1000}
                                        height={300}
                                        className="rounded-md mt-4 w-full h-auto max-w-auto "
                                        quality={100}

                                        priority
                                    />
                                </Link>
                            ) : null}


                            {/* Engagement Section */}
                            <div className="flex items-center space-x-2 mt-4">

                                <HeartIcon className={`h-5 w-5  ${color[blog._id] ? 'fill-red-700 text-red-700' : 'text-gray-500'}`} onClick={() => handleLikeClick(blog._id)} />


                                <Link href={`/blog/${blog._id}/comments`} className="  flex items-center cursor-pointer text-gray-500 hover:text-gray-800">
                                    <ChatBubbleIcon className='h-5 w-5' />
                                </Link>



                            </div>
                            <span className="text-sm text-white font-medium">
                                {blog.likes.length ? (
                                    <div className='mt-2 font-medium text-base pl-1'>
                                        {blog.likes.length} likes
                                    </div>
                                ) : null}</span>

                            <h4 className="text-base text-white font-normal mt-2 mb-3">  {isTruncated ? blog.text.slice(0, maxLength) : blog.text}
                                {blog.text.length > maxLength && (
                                    <button onClick={toggleTruncation} className="text-gray-400 ml-1 hover:underline">
                                        {isTruncated ? "..." + "more" : "less"}
                                    </button>
                                )}
                            </h4>
                            <div className="flex items-center my-4">
                                <div className="flex-grow border-b border-gray-700"></div>
                            </div>



                        </div>
                    </li>
                </div>
            ))}

        </>
        // <>
        //     {Blogs.map((blog) => (

        //         <div key={blog._id} className='m-auto'>
        //             <div className="block mx-40">
        //                 <p className='p-2 font-semibold text-lg text-gray-700'>{blog.author.username}</p>
        //                 <Image
        //                     alt=""
        //                     src={blog.img}
        //                     width={400}
        //                     height={400}

        //                     className="max-h-96 max-w-96  rounded-t-md"
        //                 />
        //                 <div className="flex items-center pt-1 space-x-4">
        //                     {/*  Passing the blog._id to the function */}
        //                     <HeartIcon  className={`h-10 w-6 ${color[blog._id] ? 'fill-red-700' : 'text-black'}`} onClick={() => handleLikeClick(blog._id)} />

        //                     <Link href={`/blog/${blog._id}/comments`} >
        //                         <ChatBubbleIcon className="h-9 w-6 text-black" />
        //                     </Link>

        //                 </div>
        //                 {blog.likes.length ? (
        //                     <div className='mt-2'>  
        //                        {blog.likes.length}
        //                     </div>
        //                 ) : null}


        //                 <p className="mt-2 pb-4 max-w-sm text-gray-700">
        //                     {isTruncated ? blog.text.slice(0, maxLength) : blog.text}
        //                     {blog.text.length > maxLength && (
        //                         <button onClick={toggleTruncation} className="text-gray-400 ml-1 hover:underline">
        //                             {isTruncated ? "..." + "more" : "less"}
        //                         </button>
        //                     )}

        //                 </p>
        //                 <hr className='h-3 border-gray-300' />
        //             </div>
        //         </div>

        //     ))}

        // </>
    )
}



