'use client'
import React, { useEffect, useState } from 'react'
import { IslandMoments } from '@/app/font';
import { HomeIcon, PlusIcon } from '@radix-ui/react-icons';
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



export default function Navbar() {
    const router = useRouter()
    const { toast } = useToast()
    const { isLoggedIn, setisLoggedIn } = useAuthStore()
    const [Username,setUsername]=useState<string>('')
    const [isAllowed,setisAllowed]=useState()

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setisLoggedIn(true)
        }

    }, [setisLoggedIn]);

    function handleProfileClick(){
        const username =localStorage.getItem('username')
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
                        <Dialog>
                            <DialogTrigger>

                                <li

                                    className="block rounded-xl px-5 py-3 text-lg font-semibold text-white hover:bg-gray-700 "
                                >
                                    <PlusIcon className="h-6 w-7 inline-flex pr-1  text-white" />     Create
                                </li>

                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className='justify-center'>
                                    <DialogTitle>Make a blog</DialogTitle>
                                    <DialogDescription>start blogging</DialogDescription>
                                </DialogHeader>
                                <CreateBlogForm action={'Add'} />
                            </DialogContent>
                        </Dialog>
                        <li>
                            <button onClick={handleProfileClick}
                                className="block rounded-xl px-5 py-3 text-lg font-semibold text-white hover:bg-gray-700 "
                            >
                                <UserIcon className="h-6 w-7 inline-flex pr-1 text-white" /> Profile
                            </button>
                        </li>

                        <li>
                            <button
                                className="block  rounded-xl px-5 py-3 text-lg font-semibold text-white hover:bg-gray-700"
                            >
                                {isLoggedIn ? (
                                    <>
                                        <LogOutIcon onClick={Logout} className="h-6 w-7 inline-flex pr-1 text-white" />
                                        <span>Logout</span>
                                    </>
                                ) : (
                                    <>
                                        <LogInIcon onClick={Login} className="h-6 w-7 inline-flex pr-1 text-white" />
                                        <span>Login</span>
                                    </>
                                )}
                            </button>
                        </li>
                    </ul>



                </div>
            </section>

            {/* bottom navbar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 border-t border-gray-700 bg-black flex justify-around items-center p-2">
                <Link href={'/'}
                    className="block rounded-lg px-4 py-2"
                >
                    <HomeIcon className="h-7 w-7 inline-flex pr-1 hover:text-gray-700 text-white" />
                </Link>
                <Dialog>
                    <DialogTrigger>
                        <div
                            className="block rounded-lg px-4 py-2"
                        >
                            <PlusIcon className="h-7 w-7 inline-flex pr-1 text-white hover:text-gray-700" />
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Make a blog</DialogTitle>
                            <DialogDescription>start blogging</DialogDescription>
                            <CreateBlogForm action={'Add'} />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <button onClick={handleProfileClick}
                    className="block rounded-lg px-4 py-2 "
                >
                    <UserIcon className="h-8 w-8 inline-flex pr-1  hover:text-gray-700 text-white" />
                </button>

            </div>

        </div>


    )
}
