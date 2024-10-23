'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Loader from '../ui/loader';
import { HeartIcon } from 'lucide-react';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import profilePic from '../../public/man.png';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [userBlogs, setuserBlogs] = useState<userBlogs[]>([])
  const [loading, setLoading] = useState(true); // Add loading state
  const [isTruncated, setIsTruncated] = useState(true); // State for truncation
  const maxLength = 50; // The maximum length before 
  const [color, setColor] = useState<ColorState>({});
  const { toast } = useToast();



  const toggleTruncation = () => {
    setIsTruncated(!isTruncated); // Toggle between truncated and full text
  };


  async function handleProfile() {
    try {
      if(params.username){
    
        const username = localStorage.getItem('username')
        const res = await axios.get(`http://localhost:4000/api/blog/userProfile/${params.username}`);
        const { foundUserBlogs } = res.data

        // Check each blog for likes
        const updatedColor: ColorState = {};

        foundUserBlogs.forEach((blog: { _id: string; likes: (string | null)[] }) => {
          updatedColor[blog._id] = blog.likes.includes(username); // Set true or false based on likes
        })

        setColor(updatedColor)
        setuserBlogs(foundUserBlogs)
      }
    } catch (error) {
      console.log(error)
      toast({
        description: "error fetching profle"
      })

    } finally {
      setLoading(false) // Set loading to false when data is fetched or an error occurs
    }
  }


  useEffect(() => {
    handleProfile()
  },[])


  async function handleLikeClick(blogId: string) {
    try {
      const username = localStorage.getItem('username')
      const token = localStorage.getItem('token')
      const headers = createAuthHeaders(token)

      if (username && token) {

        const response = await axios.post(`http://localhost:4000/api/blog/${blogId}/like`, {
        }, { headers })

        toast({
          description: response.data.message
        })
        setColor(prev => ({ ...prev, [blogId]: !prev[blogId] })); // Toggle the like state

        handleProfile()

      }
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }


  function createAuthHeaders(token: string | null) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

  }



  return (
    <>
      {userBlogs.map((blog) => (
        <div key={blog._id} className='pb-36'>
          <div className="flex items-center m-4">
            <Image
              src={profilePic}
              alt="profilepic"
              width={100}
              height={100}
              className="w-12 h-12 rounded-full mr-3"
              quality={100}
              priority
            />

            <div>
              <span className="hover:underline text-white font-semibold text-lg">{blog.author.username} </span>
              <p className=" text-gray-500 font-base text-lg">@{blog.author.username} </p>

            </div>


          </div>
          <div className="flex my-3 ">
            <div className="flex-grow border-b border-gray-700"></div>
          </div>

          <li className="flex p-4 my-2  cursor-pointer">
            <div className="flex flex-col flex-grow mx-2 xl:ml-28 xl:mr-96 lg:mx-32 md:mx-40 sm:mx-20">
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
  );
}
