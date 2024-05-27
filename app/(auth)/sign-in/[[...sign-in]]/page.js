import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

const SignInPage = () => {
   return (
      <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
         <div className='h-full lg:flex flex-col items-center justify-center px-4'>
            {/* text. */}
            <div className='text-center space-y-2 pt-8'>
               <h1 className='font-bold text-3xl text-[#2E2A47]'>
                  Welcome Back!
               </h1>
               <p className='text-base text-[#7EBCA0]'>
                  Login or Create account to get back to your dashboard!
               </p>
            </div>

            {/* form. */}
            <div className='flex items-center justify-center mt-4'>
               <ClerkLoaded>
                  <SignIn path='/sign-in' />
               </ClerkLoaded>
               <ClerkLoading>
                  <Loader2 className='animate-spin text-muted-foreground' />
               </ClerkLoading>
            </div>
         </div>

         <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center'>
            <Image src="/logo.svg" alt='Logo' width={200} height={200} />
         </div>
      </div>
   )
}

export default SignInPage
