import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Activity } from '@/lib/models/activity.model';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10);
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Activities API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const activity = new Activity({
      userId: session.user.id,
      userName: session.user.name,
      action: body.action,
      type: body.type,
      details: body.details || {}
    });
    
    await activity.save();
    
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Activity Creation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 