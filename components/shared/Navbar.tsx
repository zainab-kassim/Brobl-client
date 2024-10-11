'use client'
import React, { useEffect, useState } from 'react'
import { IslandMoments } from '@/app/font';
import { Cross2Icon, HomeIcon, PlusIcon } from '@radix-ui/react-icons';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateBlogForm from './CreateBlogForm';
import { BookmarkIcon, LogInIcon, LogOutIcon, SaveIcon, UserCircleIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import useAuthStore from './store';
import useFormStore from './useForm';



export default function Navbar() {
    const router = useRouter()
    const { toast } = useToast()
    const { isLoggedIn, setisLoggedIn } = useAuthStore()
    const { showForm, setShowForm } = useFormStore()


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setisLoggedIn(true)
        }

    }, [setisLoggedIn]);

    function handleProfileClick() {
        const username = localStorage.getItem('username')
        if (username) {

            router.push(`/profile/${username}`)

        } else {
            toast({
                description: 'Please sign in to view your profile',
            })
        }
    }

    function Logout() {

        localStorage.removeItem('token')
        localStorage.removeItem('username')

        router.push('/sign-in')
        toast({
            description: 'User logged out successfully'// Show the toast message
        })
    }

    function Login() {
        router.push('/sign-in')
    }

    function handleShowForm() {
        setShowForm(true);
    };
    function handleCloseForm() {
        console.log('Closing the form'); // Check if this logs
        setShowForm(false);
    };


    return (
        <div className='lg:flex '>
            <section className="fixed top-0  left-0 h-screen w-64 bg-black border-r border-gray-700 z-50 hidden lg:block">

                <div className="px-4  ">
                    <span className={`grid font-island-moments text-7xl mt-8 mx-3 w-32 place-content-center rounded-lg text-white`}>
                        Brobl
                    </span>

                    <ul className="mt-14 space-y-6">
                        <li>
                            <Link href={'/'}
                                className="block rounded-xl px-5 py-3 text-lg font-semibold text-white hover:bg-gray-700 "
                            >
                                <HomeIcon className="h-6 w-7 inline-flex pr-1 text-white" />  Home
                            </Link>
                        </li>
                        <div>
                            <li onClick={handleShowForm} className="block cursor-pointer  rounded-xl px-5 py-3 text-lg font-semibold text-white hover:bg-gray-700">
                                <PlusIcon className="h-6 w-7 inline-flex pr-1  text-white" />     Create
                            </li>

                            {showForm && (
                                <>
                                    <div onClick={handleCloseForm} className="fixed inset-0 cursor-pointer z-50 bg-black/80" />

                                    <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg rounded-xl bg-black border border-neutral-200 p-6 shadow-lg duration-200 translate-x-[-50%] translate-y-[-50%] gap-4 sm:rounded-lg">
                                        <h2 className="text-lg font-semibold text-white leading-none tracking-tight">Make a blog</h2>
                                        <p className="text-sm text-neutral-500 pb-2">Start blogging</p>
                                        <CreateBlogForm action={'Add'} />

                                        {/* Close Button */}
                                        <button
                                            className="absolute right-4 top-4 rounded-sm opacity-70 text-gray-400 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 disabled:pointer-events-none"
                                            onClick={handleCloseForm} // Correctly call handleCloseForm here
                                            aria-label="Close"
                                        >
                                            <Cross2Icon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </>

                            )
                            }


                        </div>



                        <li onClick={handleProfileClick} className="block cursor-pointer  rounded-xl px-5 py-3 text-lg font-semibold text-white hover:bg-gray-700">
                            <button
                            >
                                <UserIcon className="h-6 w-7 inline-flex pr-1 text-white" /> Profile
                            </button>
                        </li>

                        <li className="block  rounded-xl cursor-pointer px-5 py-3 text-lg font-semibold text-white hover:bg-gray-700">
                            <button

                            >
                                {isLoggedIn ? (

                                    <div onClick={Logout}>
                                        <LogOutIcon className="h-6 w-7 inline-flex ml-1 pr-2 text-white" />
                                        <span>Logout</span>
                                    </div>
                                ) : (
                                    <div onClick={Login}>
                                        <LogInIcon className="h-6 w-7 inline-flex ml-1 pr-2 text-white" />
                                        <span>Login</span>
                                    </div>
                                )}
                            </button>
                        </li>
                    </ul>



                </div>
            </section >

            {/* bottom navbar */}
            < div className="lg:hidden z-50  fixed bottom-0 inset-x-0 border-t border-gray-700 bg-black flex justify-around items-center p-2" >
                <Link href={'/'}
                    className="block rounded-lg px-4 py-2"
                >
                    <HomeIcon className="h-7 w-7 inline-flex pr-1 hover:text-gray-700 text-white" />
                </Link>
                <div onClick={handleShowForm} className="block rounded-lg px-4 py-2">

                    <PlusIcon className="h-7 w-7 inline-flex pr-1 text-white hover:text-gray-700" />
                </div>

                {
                    showForm && (
                        <>
                            <div onClick={handleCloseForm} className="fixed inset-0 cursor-pointer z-50 bg-black/80" />

                            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-72 sm:max-w-lg md:max-w-lg rounded-xl bg-black border border-neutral-200 p-6 shadow-lg duration-200 translate-x-[-50%] translate-y-[-50%] gap-4 sm:rounded-lg">
                                <h2 className="text-lg font-semibold text-white leading-none tracking-tight">Make a blog</h2>
                                <p className="text-sm text-neutral-500 pb-2">Start blogging</p>
                                <CreateBlogForm action={'Add'} />

                                {/* Close Button */}
                                <button
                                    className="absolute right-4 top-4 rounded-sm opacity-70 text-gray-400 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 disabled:pointer-events-none"
                                    onClick={handleCloseForm} // Correctly call handleCloseForm here
                                    aria-label="Close"
                                >
                                    <Cross2Icon className="h-6 w-6" />
                                </button>
                            </div>
                        </>

                    )
                }




                <button onClick={handleProfileClick}
                    className="block rounded-lg px-4 py-2 "
                >
                    <UserIcon className="h-8 w-8 inline-flex pr-1  hover:text-gray-700 text-white" />
                </button>

            </div >

        </div >


    )
}
