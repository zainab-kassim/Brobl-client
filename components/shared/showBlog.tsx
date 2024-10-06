'use client'
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { HeartIcon } from 'lucide-react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    FormField,
    Form,
    FormMessage,
    FormLabel
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import '../../app/globals.css'



const formSchema = z.object({
    text: z.string()
})

export default function showBlog() {
    const [loading, setLoading] = useState(true); // Add loading state



    // Initialize form with validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: '' } // Ensure default values match schema
    });


    interface Blogs {
        author: any;
        username: string;
        _id: any;
        text: string;
        img: string;
        comment: string;
    }

    return (
        <>
            {/* <article className="overflow-hidden m-3 rounded-lg h-[500px] flex flex-col">
                <h3 className="mt-0.5 text-lg text-gray-900">username</h3>

                <p className="my-1 text-sm text-gray-900">
                    text tet etxt tex ttt ui uuy
                </p>

                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    className="h-56 w-full object-cover"
                />

                <div className="bg-white text-left pb-2">
                    <div className="flex pt-1 space-x-4">
                        <HeartIcon className="h-10 w-6 text-black" />
                        <ChatBubbleIcon className="h-9 w-6 text-black" />
                    </div>

                    <Form {...form}>
                        <form className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <label
                                            htmlFor="comment"
                                            className="relative block flex-grow overflow-hidden border-b border-gray-200 bg-transparent pt-5 focus-within:border-gray-700"
                                        >
                                            <Input
                                                id="comment"
                                                {...field}
                                                className="h-8 w-full bg-transparent border-none px-2 placeholder-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                            />
                                            <span
                                                className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                                            >
                                                Add a comment
                                            </span>
                                        </label>
                                    )}
                                />

                                <Button type="submit" className="mt-5 flex-shrink-0">Submit</Button>
                            </div>
                        </form>
                    </Form>
                </div>


              
                <div className=" flex-1 overflow-y-auto hide-scrollbar bg-white text-left"> 
                    <h3 className="mt-2 text-lg text-gray-900">How to position your furniture for positivity</h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
                        pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem,
                        mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque
                        dignissimos. Molestias explicabo corporis voluptatem?
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
                        pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem,
                        mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque
                        dignissimos. Molestias explicabo corporis voluptatem?
                    </p>
                </div>
            </article> */}


            <div className='flex flex-col lg:grid-cols-2'>
                <div className='lg:col-span-1 w-96'>
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                        className="h-full w-full object-cover"
                    />

                
                </div>
                <div className='lg:col-span-1 w-96'>
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                        className="h-full w-full object-cover"
                    />
                    
                
                </div>

            </div>

        </>
    )
}

