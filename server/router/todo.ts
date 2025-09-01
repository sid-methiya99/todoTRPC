import z from 'zod'
import { isGenuineUser } from '../middleware'
import { publicProcedure, router } from '../trpc'

export const todoRouter = router({
   createTodo: publicProcedure
      .use(isGenuineUser)
      .input(
         z.object({
            title: z.string(),
            description: z.string(),
         })
      )
      .mutation(async ({ ctx, input }) => {
         try {
            const addTodo = await ctx.prisma.todo.create({
               data: {
                  title: input.title,
                  description: input.description,
                  userId: ctx.auth?.userId,
               },
            })
            return { message: 'Added todo' }
         } catch (error) {
            console.error(error)
            return { message: 'Cant add todo' }
         }
      }),

   getAllTodos: publicProcedure.query(async ({ ctx }) => {
      console.log('Control reached here')
      console.log(ctx.auth?.userId)
      try {
         const findTodos = await ctx.prisma.todo.findMany({
            where: {
               userId: ctx.auth?.userId,
            },
         })
         return findTodos
      } catch (error) {
         console.error(error)
         return []
      }
   }),
})
