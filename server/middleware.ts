import { TRPCError } from '@trpc/server'
import { middleware } from './trpc'

export const isGenuineUser = middleware(async (opts) => {
   const { ctx } = opts

   if (!ctx.auth?.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
   }

   const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId },
   })

   if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
   }

   return opts.next({
      ctx: {
         ...ctx, // keep req, res, prisma, etc.
         user, // add full user to ctx
      },
   })
})
