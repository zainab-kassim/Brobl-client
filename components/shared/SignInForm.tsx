'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    FormField,
    Form,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react'
import ButtonLoader from '../ui/buttonLoader'



const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})


export default function SignInForm() {
    const [loading, setLoading] = useState(false); // Add loading state
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            setLoading(true)
            const res = await axios.post('https://brobl-server.vercel.app/api/user/signin', {
                username: values.username,
                password: values.password
            });
            const { token, Username } = res.data
            localStorage.setItem('token', token)
            localStorage.setItem('username', Username)
            if (token) {
                router.push('/')
                toast({
                    description: res.data.message // Show the toast message
                })
            } else {
                toast({
                    description: 'Account doesnt exist' // Show the toast message
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    description: error.message // Use the destructured message
                });
            } else {
                toast({
                    description: "An unknown error occurred" // Fallback message for non-Error objects
                });
            }

            console.log(error);
        } finally {
            setLoading(false); // Set loading to false when data is fetched or an error occurs
        }
    }

    return (

        <div className="flex justify-center min-h-screen bg-white" >
            <div className="bg-white rounded-3xl mx-2 px-7 py-16  my-auto shadow-sm drop-shadow-xl ">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="font-island-moments text-7xl">Brobl</h1>
                    <p className="mb-4 px-2 text-base font-normal text-zinc-700">
                        Back to Brobl! Lets start exploring today
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-auto ">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <>
                                    <div className="my-8">
                                        <Input
                                            type="text"
                                            {...field}
                                            placeholder="Enter username"
                                            className="max-w-md rounded-md p-5 pe-3 shadow-sm"
                                            required
                                        />
                                    </div>
                                    <FormMessage />
                                </>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <>
                                    <div>
                                        <Input
                                            type="password"
                                            {...field}
                                            placeholder="Enter password"
                                            className="max-w-md rounded-md  p-5 pe-3 shadow-sm"
                                            required
                                        />
                                    </div>
                                    <FormMessage />
                                </>
                            )}
                        />
                        <p className="text-sm text-left text-zinc-900 mt-2">
                            Don't have an account? <a className="underline" href="/sign-up">Sign up</a>
                        </p>
                        <div className="flex justify-center max-w-md mt-9">
                            <Button
                                type="submit"
                                className="flex items-center justify-center bg-black text-white w-full"
                            >
                                Sign in
                                {loading && <span className="ml-2 flex items-center"><ButtonLoader /></span>}
                            </Button>

                        </div>
                    </form>
                </Form>
            </div>
        </div>

    )
}
