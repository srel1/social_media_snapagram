import { zodResolver } from "@hookform/resolvers/zod"

import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { SignInValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"
import { useNavigate } from 'react-router-dom'


const SignInForm = () => {
  const { toast } = useToast();
  const {checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignInValidation>>({
      resolver: zodResolver(SignInValidation),
      defaultValues: {
        email: '',
        password:'',
      },
    })
  
   async function onSubmit(values: z.infer<typeof SignInValidation>) {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if(!session){
        return toast({ title: 'Sign in failed. Please try again.'})
      }

      const isLoggedIn = await checkAuthUser();

      if(isLoggedIn) {
        form.reset();
        navigate('/')
      }else{
        return toast({ title: 'Sign in failed. Please try again.'})
      }
    }

return (
  <Form {...form}>
    <div className="sm:w-420 flex-center flex-col">
      <img src='/assets/image/logo.svg' alt='logo'/>
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-5">Log in to your account</h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">Welcom back, please enter your details.</p>

  
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Email</FormLabel>
            <FormControl>
              <Input type='text' className='shad-input' placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
          )}
        />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Password</FormLabel>
            <FormControl>
              <Input type='password' className='shad-input' placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
          )}
        />
      <Button type="submit" className="shad-button_primary">
        {isUserLoading ? (
        <div className="flex-center gap-2"><Loader/>Loading...</div>
        ) : 'Sign in'}
      </Button>
      <p className="text-small-regular text-light-2 text-center mt-2">
        Don't have an account? 
        <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
        .</p>
    </form>
    </div>
  </Form >
  )
}

export default SignInForm

function useCreateUserAccountMutation(): { mutateAsync: any; isLoading: any } {
  throw new Error("Function not implemented.")
}
