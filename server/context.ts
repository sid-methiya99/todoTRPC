import { TRPCError } from '@trpc/server'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

interface TokenPayload extends JwtPayload {
   id: string
}

export const verifyUser = async (token: string) => {
   try {
      const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET as string
      ) as TokenPayload
      return { userId: decoded.id }
   } catch (err) {
      throw new TRPCError({
         code: 'UNAUTHORIZED',
         message: 'Invalid or expired token',
      })
   }
}
