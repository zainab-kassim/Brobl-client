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
import { useToast } from "@/hooks/use-toast"
import { Textarea } from '../ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUploadThing } from "@/lib/uploadthing"
import { isBase64Image } from "@/lib/utils"
import useBlogsStore from './updateBlog'
import ButtonLoader from '../ui/buttonLoader'
import useFormStore from './useForm'




const formSchema = z.object({
    text: z.string().min(5, { message: "Text must be at least 5 characters long" }), // Text must be at least 5 characters
    image: z.string().min(1, { message: "An image URL is required" }), // Image URL must be provided
}).refine((data) => data.image.length > 0, {
    message: "Only one image is required",
    path: ["image"], // Error will be shown for the image field
});


export default function CreateBlogForm({ action }: { action: string }) {
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const { setBlogs } = useBlogsStore(); // Get the blogs and setBlogs from the store
    const [loading, setLoading] = useState<boolean>(false);
    const { setShowForm } = useFormStore()



    async function HandleUpdatedBlogs() {
        try {
            const res = await axios.get('https://brobl-server.vercel.app/api/blog/show');
            const { foundBlogs } = res.data
            setBlogs(foundBlogs)
        } catch (error) {
            console.log(Error)
        }
    }


    // Initialize form with validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: '', image: '' } // Ensure default values match schema
    });

    // Handle image file selection and conversion to data URL
    function handleImage(
        e: React.ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ): void {
        e.preventDefault();
        const file = e.target.files?.[0];

        if (file && file.type.startsWith("image/")) { // Ensure file is an image
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const imageDataUrl = fileReader.result?.toString() || "";
                fieldChange(imageDataUrl);
            };
            fileReader.readAsDataURL(file);
            setFiles([file]); // Update state with the selected file
        }
    }


    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const username = localStorage.getItem('username')
        if (!username) {
            toast({
                description: 'Sign in to continue'
            })
        }

        if (values.image) {
            // Check if image is base64 encoded and needs to be uploaded
            const hasImageChanged = values.image && isBase64Image(values.image);

            if (hasImageChanged) {
                // Upload image to server
                try {
                    const imgRes = await startUpload(files);
                    if (imgRes?.[0]?.url) {
                        values.image = imgRes[0].url;
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                    //do a toast here, saying choose an image less than 1mb
                }
            }
        }

        // Handle form submission logic (e.g., API call)
        if (action === 'Add') {
            try {
                // Set loading to true while submitting

                // API call to create interaction
                const username = localStorage.getItem('username')
                const token = localStorage.getItem('token')
                if (username && token) {
                    form.reset();
                    setFiles([]); // Clear the files state to remove the image
                    const imageInput = document.getElementById('image-input') as HTMLInputElement;
                    if (imageInput) {
                        imageInput.value = ''; // Clear the file input field manually
                    }
                    const headers = createAuthHeaders(token)
                    const res = await axios.post('https://brobl-server.vercel.app/api/blog/create', {
                        text: values?.text,
                        img: values?.image,


                    }, { headers })

                    const { message, newBlog } = res.data;
                    toast({
                        description: message,

                    });

                    HandleUpdatedBlogs()
                    setShowForm(false)
                } else {
                    router.push('/sign-up')
                }

            } catch (error: any) {

                console.error('Error occurred while making a BlOG:', error);
                toast({
                    description: error
                });

                // Default error message
                let errorMessage = 'An error occurred. Please try again.';

                // Check if the error is an Axios error
                if (axios.isAxiosError(error)) {
                    // Check for a response error
                    if (error.response) {
                        // Extract message from response if available
                        errorMessage = error.response.data?.message || errorMessage;
                    } else {
                        // Handle cases where no response is available (e.g., network errors)
                        errorMessage = 'Network error. Please try again.';
                    }
                } else {
                    // Handle unexpected error types
                    errorMessage = 'An unexpected error occurred. Please try again later.';
                }

            } finally {
                setLoading(false); // Set loading to false when data is fetched or an error occurs
            }
        }

        function createAuthHeaders(token: string | null) {
            return {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

        }
    }



    return (
        <div className='bg-black'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-white">
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <>
                                <Textarea rows={4} {...field} className="max-w- font-normal text-white px-3 py-2 border rounded-md focus:outline-none" />
                                <FormMessage />
                            </>
                        )}

                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <>
                                <div className="relative text-white">
                                    <label
                                        htmlFor="image-input"
                                        className="block max-w-full text-lg px-3 py-2 text-white border rounded-md cursor-pointer hover:bg-gray-700"
                                    >
                                        {form.watch('image') ? (<div className='cursor-pointer'>File Selected</div>) : (<div className='cursor-pointer'>Choose File</div>)}
                                    </label>
                                    <input
                                        id="image-input"
                                        accept="image/*"
                                        onChange={(e) => handleImage(e, field.onChange)}
                                        type="file"
                                        className="absolute inset-0 w-full h-full text-white opacity-0 cursor-pointer"
                                    />
                                </div>
                                <FormMessage />
                            </>
                        )}
                    />


                    <button
                        className='flex items-center justify-center font-medium text-base text-white hover:bg-zinc-900 bg-zinc-800 px-3 py-1 rounded-lg'
                        type="submit"
                    >
                        Submit
                        {loading && <span className="ml-2 flex items-center"><ButtonLoader /></span>}
                    </button>
                </form>
            </Form>
        </div>
    )
}



