import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, PhotoIcon } from "@heroicons/react/16/solid"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { createClient } from '@/utils/supabase/client'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const supabase = createClient()

const formSchema = z.object({
    description: z.string().min(10, {
        message: "Post must be at least 10 characters.",
    }),
    image: z.any()
        .refine((file) => file?.length > 0, "Image is required.")
        .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
})



export default function AddPostModal() {
    const [preview, setPreview] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            image: null
        },
    })

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.[0]) {
            form.setValue("image", acceptedFiles)
            setPreview(URL.createObjectURL(acceptedFiles[0]))
        }
    }, [form])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp']
        },
        maxSize: MAX_FILE_SIZE,
        multiple: false
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)

            if (!values.image?.[0]) {
                throw new Error('No image selected')
            }

            // Upload image to Supabase Storage directly
            const file = values.image[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError, data } = await supabase.storage
                .from('posts')
                .upload(filePath, file)

            if (uploadError) {
                console.error('Upload error:', uploadError)
                throw new Error(`Upload failed: ${uploadError.message}`)
            }

            // Get public URL for the uploaded image
            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(filePath)

            // Store post data in Supabase database
            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    image_url: publicUrl,
                    description: values.description,
                    user_id: 'user_id',
                    created_at: new Date().toISOString(),
                })

            if (insertError) {
                throw insertError
            }

            // Reset form and close modal
            form.reset()
            setPreview(null)
            setOpen(false)

        } catch (error) {
            console.error('Error:', error)
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Post<PlusCircleIcon className="size-4" /></Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(event) => {
                if (isLoading) event.preventDefault()
            }} className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Post</DialogTitle>
                    <DialogDescription>
                        Please fill in the form below to add a new post.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <div
                                            {...getRootProps()}
                                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                                                ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}
                                            `}
                                        >
                                            <input {...getInputProps({ onChange })} />
                                            {preview ? (
                                                <div className="relative w-full h-48">
                                                    <Image
                                                        src={preview}
                                                        alt="Preview"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-4">
                                                    <PhotoIcon className="size-8 text-gray-400" />
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        {isDragActive ? "Drop the image here" : "Drag & drop image here, or click to select"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        PNG, JPG, WEBP up to 5MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Type here your post..." className="h-24" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Adding Post..." : "Add Post"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
