import z from 'zod'
import { publicProcedure, router } from '../trpc'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils'
import { TRPCError } from '@trpc/server'

export const userRouter = router({
   signup: publicProcedure
      .input(
         z.object({
            username: z.string(),
            password: z.string(),
         })
      )
      .output(
         z.object({
            token: z.string().optional(),
         })
      )
      .mutation(async ({ input, ctx }) => {
         const username = input.username
         const password = input.password

         const findUser = await ctx.prisma.user.findFirst({
            where: {
               username: username,
            },
         })

         if (findUser) {
            throw new TRPCError({
               code: 'NOT_IMPLEMENTED',
               message: 'Username already taken',
            })
         }
         try {
            const createUser = await ctx.prisma.user.create({
               data: {
                  username,
                  password,
               },
            })

            const token = jwt.sign(
               {
                  id: createUser.id,
               },
               JWT_SECRET!
            )
            return { token }
         } catch (error) {
            console.error(error)
            return { token: undefined }
         }
      }),
   signIn: publicProcedure
      .input(
         z.object({
            username: z.string(),
            password: z.string(),
         })
      )
      .output(
         z.object({
            token: z.string().optional(),
         })
      )
      .mutation(async ({ input, ctx }) => {
         const username = input.username
         const password = input.password
         try {
            const findUser = await ctx.prisma.user.findFirst({
               where: {
                  username: username,
               },
            })
            if (!findUser) {
               throw new TRPCError({
                  code: 'UNAUTHORIZED',
                  message: 'Invalid username or password',
               })
            }

            const validPassword = findUser.password === password // replace with hash compare

            if (!validPassword) {
               throw new TRPCError({
                  code: 'UNAUTHORIZED',
                  message: 'Invalid username or password',
               })
            }
            console.log(JWT_SECRET)
            const token = jwt.sign(
               {
                  id: findUser.id,
               },
               JWT_SECRET!
            )
            return { token }
         } catch (error) {
            console.error(error)
            return { token: undefined }
         }
      }),
})
