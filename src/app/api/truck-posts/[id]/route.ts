import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import TruckPost from '@/models/TruckPost';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const post = await TruckPost.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching truck post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch truck post' },
      { status: 500 }
    );
  }
} 