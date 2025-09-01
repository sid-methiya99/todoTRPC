import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { trpc } from '../utils/trpc'

export const Home = () => {
   const titleRef = useRef<HTMLInputElement>(null)
   const descRef = useRef<HTMLInputElement>(null)
   const todos = useQuery(trpc.todo.getAllTodos.queryOptions())
   const queryClient = useQueryClient()
   const submitTodo = useMutation(trpc.todo.createTodo.mutationOptions())

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const title = titleRef.current?.value
      const description = descRef.current?.value

      if (!title || !description) {
         alert('Please enter both title and description')
         return
      }

      submitTodo.mutate(
         { title, description },
         {
            onSuccess: (data) => {
               console.log('Added successfully', data)
               queryClient.invalidateQueries(
                  trpc.todo.getAllTodos.queryOptions()
               )
               // Reset form fields properly
               if (titleRef.current) {
                  titleRef.current.value = ''
               }
               if (descRef.current) {
                  descRef.current.value = ''
               }
            },
            onError: (err) => {
               console.error('Create todo failed:', err)
            },
         }
      )
   }

   // Handle loading state
   if (todos.isLoading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-2 text-gray-600">Loading todos...</p>
            </div>
         </div>
      )
   }

   // Handle error state
   if (todos.error) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="text-center">
               <p className="text-red-600">
                  Error loading todos: {todos.error.message}
               </p>
               <button
                  onClick={() => todos.refetch()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
               >
                  Retry
               </button>
            </div>
         </div>
      )
   }

   // Get todos data with fallback to empty array
   const todosData = todos.data || []

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
         <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
               My Todos ✅
            </h1>

            {/* Todo Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Title
                  </label>
                  <input
                     ref={titleRef}
                     type="text"
                     placeholder="Enter todo title"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Description
                  </label>
                  <input
                     ref={descRef}
                     placeholder="Enter todo description"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
               </div>
               <button
                  type="submit"
                  disabled={submitTodo.isPending}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
               >
                  {submitTodo.isPending ? 'Adding...' : 'Add Todo'}
               </button>
            </form>

            {/* Todo List */}
            {todosData.length === 0 ? (
               <p className="text-gray-500 text-center">
                  No todos yet. Add one above!
               </p>
            ) : (
               <ul className="space-y-4">
                  {todosData.map((todo, index) => (
                     <li
                        key={todo.id || index} // Use todo.id if available, fallback to index
                        className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                     >
                        <h2 className="text-lg font-semibold text-gray-800">
                           {todo.title}
                        </h2>
                        <p className="text-gray-600">{todo.description}</p>
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </div>
   )
}
