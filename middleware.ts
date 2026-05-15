export { auth as middleware } from '@/lib/auth'
export const config = {
  matcher: ['/dashboard/:path*', '/album/:path*', '/api/albums/:path*'],
}
