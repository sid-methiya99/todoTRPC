import type { AppRouter } from '../../../server/router.ts'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         // ...
      },
   },
})

const trpcClient = createTRPCClient<AppRouter>({
   links: [
      httpBatchLink({
         url: 'http://localhost:4000/trpc',
         headers: () => {
            const token = localStorage.getItem('token')
            return { Authorization: `Bearer ${token}` }
         },
      }),
   ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
   client: trpcClient,
   queryClient,
})
