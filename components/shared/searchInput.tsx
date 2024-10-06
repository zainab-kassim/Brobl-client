'use client'
import React, { useEffect } from 'react'
import { IslandMoments } from '@/app/font';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import useAuthStore from './store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';




export default function searchInput() {
    const router = useRouter()
    const { toast } = useToast()
    const { isLoggedIn, setisLoggedIn } = useAuthStore()

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setisLoggedIn(true)
        }

    },[setisLoggedIn])
    
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
        <div className="flex items-center justify-between w-full  ">
            <span
                className={`inline-block font-island-moments  text-4xl text-white lg:hidden`}
            >
                Brobl
            </span>

           
            {isLoggedIn ? (
                <>
                    <LogOutIcon onClick={Logout} className="h-6 w-7 inline-flex lg:hidden text-white" />
                 
                </>
            ) : (
                <>
                    <LogInIcon onClick={Login} className="h-6 w-7 inline-flex lg:hidden text-white" />
             
                </>
            )}
     
        </div>

    )
}

