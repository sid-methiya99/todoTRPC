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
   links: [httpBatchLink({ url: 'http://localhost:2022' })],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
   client: trpcClient,
   queryClient,
})
