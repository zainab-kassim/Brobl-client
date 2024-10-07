'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import {
  Form,
  FormField,
  FormMessage,
} from "@/components/ui/form"
import Pic1 from "../../public/julian-hochgesang-7SV4cz3UFEI-unsplash.jpg"
import Image from "next/image"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Island_Moments } from 'next/font/google';




const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

const islandMoments = Island_Moments({
  weight: '400',
  subsets: ['latin'],
});


export default function SignUpForm() {
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

      const res = await axios.post('https://brobl-server.vercel.app/api/user/signup', {
        username: values.username,
        password: values.password
      });
      const { token, Username, message } = res.data
      console.log(token)
      localStorage.setItem('token', token)
      localStorage.setItem('username', Username)
      toast({
        description: res.data.message// Show the toast message
      })
      if (!res.data.existingUser) {
        router.push('/')
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
    }

  }


  return (

    <div className="flex justify-center min-h-screen bg-white" >
      <div className="bg-white rounded-3xl mx-2 px-7 py-16  my-auto shadow-sm drop-shadow-xl ">
        <div className="mx-auto max-w-lg text-center ">
          <h1 className={`${islandMoments.className} text-7xl`}>Brobl</h1>
          <p className="mb-4 px-2 text-base font-normal text-zinc-700">
            Share your thoughts and ideas today
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
              Already have an account? <a className="underline" href="/sign-in">Sign in</a>
            </p>
            <div className="flex justify-center mt-9">
              <Button type="submit" className="text-center  bg-black text-white py-1.5 px-24">
                Sign up
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
