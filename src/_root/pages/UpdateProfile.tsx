
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { UserUpdateValidation } from "@/lib/validation";
import { useGetCurrentUser, useUpdateUser } from "@/lib/react-query/queries";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import ProfileUploader from "@/components/shared/ProfileUploader";


const UpdateProfile = () => {
  //const { user3 } = useUserContext();
  const { mutateAsync: updateUser, isLoading: isLoadingUpdate} = useUpdateUser();
  const navigate = useNavigate()
  const {data: user} = useGetCurrentUser()
  //console.log(user, 'at updateprofile')

  console.log(user, "at update profile")


  //1. Create form
  const form = useForm<z.infer<typeof UserUpdateValidation>>({
    resolver: zodResolver(UserUpdateValidation),
    defaultValues: {
      name: user ? user?.name : "",
      bio: user ? user?.bio : "",
      username: user ? user?.username : "",
      email: user ? user?.email : "",
      file: [],
    },
  })

  if(!user){
    return <Loader/>
  }


  // 2. Define a submit handler.
   async function handleSubmit(values: z.infer<typeof UserUpdateValidation>){
    if(user){
      const updatedUser = await updateUser({
        name: values.name,
        bio: values.bio,
        file: values.file,
        userId: user.$id,
        imageId: user.imageId,
        imageUrl: user.imageUrl,
      })

      if(!updatedUser){
        toast({ title: `User update failed. Please try again`})
      }

      return navigate(`/profile/${user.$id}`)
   }
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="flex items-center justify-start w-full gap-3 max-w-5xl">
          <img src="/assets/icons/edit.svg"
            alt="edit-profile"
            height={36}
            width={36}
            className='invert-white'
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <div className="w-full">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
            
              {/* <div className="flex items-center justify-start gap-5">
                <img src={user?.imageUrl}
                  alt='profile-image'
                  width={90}
                  height={90}
                  className="rounded-full"
                />
                <button className="text-primary-500">Change profile Photo</button>
              </div> */}

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormControl>
                      <ProfileUploader fieldChange={field.onChange} mediaUrl={user.imageUrl}/>
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white !important">Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input custom-scrollbar" {...field} />
                    </FormControl>
                    <FormMessage className="text-red !important" />
                  </FormItem>
                )}
              />

              <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white !important">Bio</FormLabel>
                    <FormControl>
                      <Textarea className="shad-textarea custom-scrollbar" {...field} />
                    </FormControl>
                    <FormMessage className="text-red !important" />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 items-center justify-end">
                <Button type="button" onClick={() => navigate(-1)} className="h-12 bg-dark-4 px-5 text-light-1 flex gap-2 !important">Cancel</Button>
                <Button type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2 !important whitespace-nowrap"
                  disabled={isLoadingUpdate}
                >
                  {isLoadingUpdate && 'Loading...'} Update User
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile
