import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { CargoPost } from '@/lib/models/cargo-post.model';
import { TruckPost } from '@/lib/models/truck-post.model';
import { Document, Types } from 'mongoose';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

interface BaseDocument extends Document {
  _id: Types.ObjectId;
  status: string;
  createdAt: Date;
}

interface CargoPostDocument extends BaseDocument {
  loadingCity: string;
  unloadingCity: string;
}

interface TruckPostDocument extends BaseDocument {
  title: string;
  currentLocation: string;
  destination: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Return empty activities since we removed cargo and vehicle posts
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activities' },
      { status: 500 }
    );
  }
} 