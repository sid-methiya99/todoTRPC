import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { trpc } from '../utils/trpc'
import { useNavigate, useNavigation } from 'react-router'

export const SignUp = () => {
   const userRef = useRef<HTMLInputElement>(null)
   const passwordRef = useRef<HTMLInputElement>(null)
   const navigate = useNavigate()

   // ✅ Hook at component top-level
   const signup = useMutation(trpc.user.signup.mutationOptions())

   const onSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const username = userRef.current?.value
      const password = passwordRef.current?.value

      if (!username || !password) {
         alert('Please enter username and password')
         return
      }

      // ✅ Call mutate
      signup.mutate(
         { username, password },
         {
            onSuccess: (data) => {
               if (!data?.token) {
                  console.log('No token received')
                  return
               }
               localStorage.setItem('token', data.token)
               navigate('/home')
            },
            onError: (err) => {
               console.error('Signup failed:', err)
            },
         }
      )
   }
   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
               Create Account
            </h2>
            <p className="text-center text-gray-500 mb-8">
               Sign up to get started 🚀
            </p>

            <form className="space-y-6">
               {/* Username */}
               <div>
                  <label
                     htmlFor="username"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Username
                  </label>
                  <input
                     ref={userRef}
                     id="username"
                     type="text"
                     placeholder="Enter your username"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
               </div>

               {/* Password */}
               <div>
                  <label
                     htmlFor="password"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Password
                  </label>
                  <input
                     ref={passwordRef}
                     id="password"
                     type="password"
                     placeholder="••••••••"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
               </div>

               {/* Submit */}
               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300"
                  onClick={(e: any) => onSubmit(e)}
               >
                  Sign Up
               </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
               Already have an account?{' '}
               <a href="/signin" className="text-blue-600 hover:underline">
                  Log in
               </a>
            </p>
         </div>
      </div>
   )
}
