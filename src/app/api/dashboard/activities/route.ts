import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Activity } from '@/lib/models/activity.model';
import { User } from '@/lib/models/user.model';

export const dynamic = 'force-dynamic';

// Set runtime to Node.js
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Kullanıcı rolüne göre filtreleme koşulları
    const userFilter = currentUser.role === 'admin' ? {} : { userId: currentUser._id };

    // Son aktiviteleri getir
    const activities = await Activity.find(userFilter)
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(activities);
    
  } catch (error) {
    console.error('Dashboard Activities API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 