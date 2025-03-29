import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TruckPost from '@/models/TruckPost';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const post = await TruckPost.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
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