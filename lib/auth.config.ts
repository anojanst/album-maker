import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
  },
  providers: [],
}
