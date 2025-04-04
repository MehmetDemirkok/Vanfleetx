import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cargo-posts/:path*',
    '/truck-posts/:path*',
    '/profile/:path*'
  ]
};

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (token?.sub) { // If user is logged in
      // Instead of using Mongoose directly, we'll call our API endpoint
      // This will be handled by the client-side code
      // The middleware will just pass through
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }
  
  return NextResponse.next();
} 