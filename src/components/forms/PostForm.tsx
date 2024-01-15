import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { Input } from "../ui/input"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useToast } from "../ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutation"
 
type PostFromProps = {
  post?: Models.Document;
  action: 'Create' | 'Update';
}

const PostForm = ({ post, action }: PostFromProps) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate()

  const { mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePost();
  
  const { mutateAsync: updatePost, isPending: isLoadingUpdate} = useUpdatePost();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(',') : "",
    },
  })

  // 2. Define a submit handler.
  async function handleSubmit(values: z.infer<typeof PostValidation>){
    if(post && action === 'Update'){
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })

      if(!updatedPost){
        toast({ title: `${action} post failed. Please try again`})
      }

      return navigate(`/posts/${post.$id}`)
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    });
    console.log(values)

    if(!newPost){
      return toast({
        title: "An error occured creating the post, please try again.",
      })
    }

    navigate('/')
  }

  

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="text-red !important"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl}/>
              </FormControl>
              <FormMessage className="text-red !important"/>
            </FormItem>
          )}
          />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Add Location</FormLabel>
              <FormControl>
                <Input 
                  type='text' 
                  className='shad-input'
                  {...field}
                  />
              </FormControl>
              <FormMessage className="text-red !important"/>
            </FormItem>
          )}
          />

          <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Add tags (separated by comma " , ")</FormLabel>
              <FormControl>
                <Input 
                  type='text' 
                  className='shad-input'
                  placeholder='JS, React, NextJS'
                  {...field}
                  />
              </FormControl>
              <FormMessage className="text-red !important"/>
            </FormItem>
          )}
          />
          
          <div className="flex gap-4 items-center justify-end">
            <Button type="button" onClick={() => navigate(-1)} className="h-12 bg-dark-4 px-5 text-light-1 flex gap-2 !important">Cancel</Button>
            <Button type="submit" 
              className="bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2 !important whitespace-nowrap"
              disabled={isLoadingCreate || isLoadingUpdate}
            >
              {isLoadingCreate || isLoadingUpdate && 'Loading...'} {action}  Post
            </Button>
          </div>
      </form>
    </Form>
    </>
  )
}

export default PostForm


