import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { EmptyTruckPost } from '@/models/EmptyTruckPost';
import TruckPost from '@/models/TruckPost';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const posts = await TruckPost.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
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

    await dbConnect();
    const data = await request.json();

    const post = await TruckPost.create({
      ...data,
      userId: session.user.id,
      status: 'active'
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating truck post:', error);
    return NextResponse.json(
      { error: 'Failed to create truck post' },
      { status: 500 }
    );
  }
} 