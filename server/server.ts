import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './router'
import { prisma } from './prisma'
import { verifyUser } from './context'
import cors from 'cors'

const app = express()

const createContext = async (opts: trpcExpress.CreateExpressContextOptions) => {
   let auth: null | { userId: string } = null

   // try to verify token only if provided
   const token = opts.req.headers.authorization?.split(' ')[1] // "Bearer <token>"

   if (token) {
      try {
         auth = await verifyUser(token) // your jwt verification logic
      } catch (err: unknown) {
         //@ts-ignore
         console.warn('Invalid token:', err.message)
      }
   }

   return {
      ...opts,
      prisma,
      auth,
   }
}

export type Context = Awaited<ReturnType<typeof createContext>>
app.use(express.json())
app.use(cors())
app.use(
   '/trpc',
   trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
   })
)

app.listen(4000, () => {
   console.log('Server running on port 3000')
})
