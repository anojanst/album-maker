import type { NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
  },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: 'noreply@kisku.online',
    }),
  ],
}
