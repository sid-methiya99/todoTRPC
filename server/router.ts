import { todoRouter } from './router/todo'
import { userRouter } from './router/user'
import { router } from './trpc'

export const appRouter = router({
   user: userRouter,
   todo: todoRouter,
})

export type AppRouter = typeof appRouter
