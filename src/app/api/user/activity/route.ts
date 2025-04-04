import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const User = mongoose.model('User');
    
    // Update user's last active time
    await User.findByIdAndUpdate(session.user.id, {
      lastActive: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User Activity API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 