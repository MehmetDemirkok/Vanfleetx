import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { EmptyTruckPost } from '@/models/EmptyTruckPost';

export async function GET() {
  try {
    await connectToDatabase();
    const truckPosts = await EmptyTruckPost.find({})
      .sort({ createdAt: -1 })
      .populate('company', 'name');
    
    return NextResponse.json(truckPosts);
  } catch (error) {
    console.error('Error fetching truck posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch truck posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const truckPost = await EmptyTruckPost.create({
      ...body,
      company: session.user.id,
      status: 'ACTIVE',
    });

    return NextResponse.json(truckPost, { status: 201 });
  } catch (error) {
    console.error('Error creating truck post:', error);
    return NextResponse.json(
      { error: 'Failed to create truck post' },
      { status: 500 }
    );
  }
} 