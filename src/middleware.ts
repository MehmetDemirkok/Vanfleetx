import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

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
    
    if (token?.sub) { // Eğer kullanıcı oturum açmışsa
      await connectToDatabase();
      const User = mongoose.model('User');
      
      // Kullanıcının son aktif zamanını güncelle
      await User.findByIdAndUpdate(token.sub, {
        lastActive: new Date()
      });
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }
  
  return NextResponse.next();
} 