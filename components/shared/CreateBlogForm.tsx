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



const formSchema = z.object({
    text: z.string().optional(),
    image: z.string().optional(),
}).refine((data) => data.text || data.image, {
    message: "Either text or image must be provided",
    path: ["text", "image"], // Error can be shown for both fields
});

export default function CreateBlogForm({ action }: { action: string }) {
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);




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
                    const res = await axios.post('https://localhost:4000/api/blog/create', {
                        text: values?.text,
                        img: values?.image,


                    }, { headers })

                    const { message, newBlog } = res.data;
                    toast({
                        description: message
                    });



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
                            <Textarea rows={4} {...field} className="max-w-full text-white px-3 py-2 border rounded-md focus:outline-none" />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <div className="relative text-white">
                                <label
                                    htmlFor="image-input"
                                    className="block max-w-full px-3 py-2 text-white border rounded-md cursor-pointer hover:bg-gray-700"
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
                        )}
                    />


                    <button className='text-right text-white bg-zinc-700 px-2 py-1 rounded-lg' type="submit">Submit</button>
                </form>
            </Form>
        </div>
    )
}



