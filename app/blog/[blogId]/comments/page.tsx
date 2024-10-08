'use client'
import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { DivideIcon, EllipsisIcon, EllipsisVertical, EllipsisVerticalIcon, HeartIcon } from 'lucide-react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FormField,
  Form,
  FormMessage,
  FormLabel
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SkeletonCard } from '@/components/shared/skeletoncard';
import ProfilePic from './../../../../public/man.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




const formSchema = z.object({
  text: z.string()
})


export default function comments({ params }: { params: { blogId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state
  const [Blog, setBlog] = useState<Blog | null>(null);
  const [isTruncated, setIsTruncated] = useState(true); // State for truncation
  const maxLength = 50; // The maximum length before 
  const [color, setColor] = useState<ColorState>({});
  const [isOwner, setisOwner] = useState(false);
  const [commentOwner, setCommentOwner] = useState<string | null>('');




  type ColorState = {
    [key: string]: boolean; // Each blog ID will map to a boolean indicating like state
  };



  // Initialize form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' } // Ensure default values match schema
  });

  interface Author {
    username: string;
    _id:string;
  }

  interface Comment {
    author: { username: string,_id:string };
    _id: string;
    text: string;
  }

  interface Blog {
    author: Author;
    username: string;
    _id: string;
    text: string;
    img: string;
    likes: Likes[];
    comments: Comment[];
  }

  interface Likes {
    _id: string;
  }




  const toggleTruncation = () => {
    setIsTruncated(!isTruncated); // Toggle between truncated and full text
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // API call to create interaction
      const username = localStorage.getItem('username')
      const token = localStorage.getItem('token')
      if (username && token) {
        form.reset()
        const headers = createAuthHeaders(token)
        const res = await axios.post(`https://localhost:4000/api/blog/${params.blogId}/comment/create`, {
          text: values?.text

        }, { headers })
        // Automatically close the dialog after a short delay
        handleBlog()

        toast({
          description: res.data.message
        });


      } else {
        toast({
          description: "Create an account to comment"
        })
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

  async function handleBlog() {
    try {
      const username = localStorage.getItem('username')

      const res = await axios.get(`https://localhost:4000/api/blog/${params.blogId}`);
      const { foundBlog } = res.data;

      // Check each blog for likes
      const updatedColor: ColorState = {};

      updatedColor[foundBlog._id] = foundBlog.likes.includes(username); // Set true or false based on likes


      if (username === foundBlog.author.username) {
        setisOwner(true)
      }
      setCommentOwner(username)
      setBlog(foundBlog)
      setColor(updatedColor)
  

    } catch (error) {
      toast({
        description: 'Error fetching blog',
      });
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false); // Set loading to false when data is fetched or an error occurs
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const username = localStorage.getItem('username')
      const token = localStorage.getItem('token')
      const headers = createAuthHeaders(token)
      if (username && token) {
        const response = await axios.delete(`https://localhost:4000/api/blog/${params.blogId}/comment/${commentId}/delete`,
          { headers })
        const { message } = response.data
        toast({
          description: message
        })
        handleBlog()
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDeleteBlog() {
    try {
      const username = localStorage.getItem('username')
      const token = localStorage.getItem('token')
      const headers = createAuthHeaders(token)
      if (username && token) {
        const response = await axios.delete(`https://localhost:4000/api/blog/${params.blogId}/delete`,
          { headers })
        const { message } = response.data
        toast({
          description: message
        })
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleLikeClick(blogId: string) {
    try {
      const username = localStorage.getItem('username')
      const token = localStorage.getItem('token')
      const headers = createAuthHeaders(token)

      if (username && token) {

        const response = await axios.post(`https://localhost:4000/api/blog/${blogId}/like`,{ 
        },{ headers })

        toast({
          description: response.data.message
        })
        setColor(prev => ({ ...prev, [blogId]: !prev[blogId] })); // Toggle the like state
        handleBlog()
      }else{
        toast({
            description:'sign in to continue'
        })
    }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    handleBlog();
  }, [params.blogId]);

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <>
      {Blog && (

        <div >
          <li className="flex p-4 my-2  cursor-pointer pb-36">
            <div className="flex flex-col flex-grow mx-2 xl:ml-28 xl:mr-96 lg:mx-32 md:mx-40 sm:mx-20">
              <div className="flex items-center  justify-between mb-1 ">
                <div className="flex items-center">
                  <Image
                    src={ProfilePic}
                    alt="profilepic"
                    width={100}
                    height={100}
                    className="w-8 h-8 rounded-full mr-2"
                    quality={100}
                    priority
                  />
                  <Link href={`/profile/${Blog.author.username}`} >
                    <p>
                      <span className="hover:underline text-white font-semibold text-lg">{Blog.author.username} </span>
                    </p>
                  </Link>
                </div>
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 inline-flex" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <button onClick={handleDeleteBlog}>
                        <p className=' font-base px-1'>Delete</p>
                      </button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>




              {Blog.img ? (
                <Image
                  alt="blog-image"
                  src={Blog.img}
                  width={1000}
                  height={300}
                  className="rounded-md mt-4 w-full h-auto max-w-auto "
                  quality={100}

                  priority
                />
              ) : null}


              {/* Engagement Section */}
              <div className="flex items-center space-x-2 mt-4">

                <HeartIcon className={`h-5 w-5  ${color[Blog._id] ? 'fill-red-700 text-red-700' : 'text-gray-500'}`} onClick={() => handleLikeClick(Blog._id)} />


                <Link href={'/'} className="  flex items-center cursor-pointer text-gray-500 hover:text-gray-800">
                  <ChatBubbleIcon className='h-5 w-5' />
                </Link>



              </div>
              <span className="text-sm text-white font-medium">
                {Blog.likes.length ? (
                  <div className='mt-2 font-medium text-base pl-1'>
                    {Blog.likes.length} likes
                  </div>
                ) : null}</span>

              <h4 className="text-base text-white font-normal mt-2 mb-3">  {isTruncated ? Blog.text.slice(0, maxLength) : Blog.text}
                {Blog.text.length > maxLength && (
                  <button onClick={toggleTruncation} className="text-gray-400 ml-1 hover:underline">
                    {isTruncated ? "..." + "more" : "less"}
                  </button>
                )}
              </h4>
              <div className="flex items-center my-4">
                <div className="flex-grow border-b border-gray-700"></div>
              </div>
              <div>
                {Blog.comments.length > 0 && (

                  Blog.comments.map((comment) => (
                    <div key={comment._id}>
                      <div className='flex justify-between'>
                        <div className="flex items-center">
                          <Image
                            src={ProfilePic}
                            alt="profilepic"
                            width={100}
                            height={100}
                            className="w-6 h-6 rounded-full mr-2"
                            quality={100}
                            priority
                          />
                          <Link href={`/profile/${comment.author.username}`}>
                          <h3 className="text-lg hover:underline font-semibold text-white">{comment.author.username}</h3>
                          </Link>
                        </div>
                        {comment.author.username === commentOwner && (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <EllipsisIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 inline-flex" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <button onClick={() => handleDeleteComment(comment._id)}>
                                <p className='font-base px-1'>Delete</p>
                              </button>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <div className=" text-sm pb-2 text-white">
                        <div className='py-2'>
                          {comment.text}
                        </div>

                        <div className="flex items-center my-1">
                          <div className="flex-grow border-b border-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  ))

                )}
              </div>

              <section className='my-4 text-white'>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex items-center space-x-4">
                      <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                          <label
                            htmlFor="comment"
                            className="relative block flex-grow overflow-hidden border-b border-gray-900 bg-transparent pt-5 focus-within:border-gray-700"
                          >
                            <Input
                              id="comment"
                              {...field}
                              className="h-8 w-full bg-transparent border-none px-2 placeholder-transparent focus:outline-none focus:ring-0 sm:text-sm" />
                            <span
                              className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                            >
                              Add a comment
                            </span>
                          </label>
                        )} />
                      <Button type="submit" className="flex-shrink-0">post</Button>
                    </div>
                  </form>
                </Form>
              </section>



            </div>
          </li>
        </div>


      )}








      {/* {Blog && (
        <div className="flex flex-col md:grid md:grid-cols-2 mx-auto  gap-3 pb-20  sm:pb-20 md:p-10">
          <div className="md:col-span-1 xs:hidden">

            <Image
              alt="Blog Image"
              src={Blog.img} // No need for optional chaining since Blog is guaranteed to exist
              width={200}
              height={300}
              className="w-full max-h-80   pb-1 rounded-lg object-cover" />


            <div className="bg-white text-left">
              <div className="flex pt-1 space-x-4">
                <HeartIcon className="h-10 w-6 text-black" />
                <Link href='/'>
                  <ChatBubbleIcon className="h-9 w-6 text-black" />
                </Link>
              </div>
            </div>

          </div>
          <div className="md:col-span-1 max-h-80   bg-white flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">{Blog.author.username}</h3>
            <div className="bg-white text-left pb-2">
              {Blog.text}
            </div>
            <hr className='h-px' />

            <div className="max-h-72 overflow-y-auto  px-1 hide-scrollbar">
              {Blog.comments.length > 0 && (

                Blog.comments.map((comment) => (
                  <div key={comment._id}>
                    <h3 className="text-lg font-semibold  text-gray-900">{comment.author.username}</h3>
                    <p className=" text-sm pb-2 text-gray-500">
                      {comment.text}
                    </p>
                  </div>
                ))

              )}
            </div>
            <hr className='h-px' />
            <section className='my-4'>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <label
                          htmlFor="comment"
                          className="relative block flex-grow overflow-hidden border-b border-gray-900 bg-transparent pt-5 focus-within:border-gray-700"
                        >
                          <Input
                            id="comment"
                            {...field}
                            className="h-8 w-full bg-transparent border-none px-2 placeholder-transparent focus:outline-none focus:ring-0 sm:text-sm" />
                          <span
                            className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                          >
                            Add a comment
                          </span>
                        </label>
                      )} />
                    <Button type="submit" className="mt-3 flex-shrink-0">post</Button>
                  </div>
                </form>
              </Form>
            </section>
          </div>
        </div>

      )} */}
    </>



  )
}
