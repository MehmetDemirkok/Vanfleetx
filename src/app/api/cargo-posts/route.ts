import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { CargoPost } from '@/models/CargoPost';

export async function GET() {
  try {
    await connectToDatabase();
    const cargoPosts = await CargoPost.find({}).sort({ createdAt: -1 });
    return NextResponse.json(cargoPosts);
  } catch (error) {
    console.error('Error fetching cargo posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cargo posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const cargoPost = new CargoPost({
      ...body,
      userId: session.user.id,
      status: 'active',
      createdAt: new Date(),
    });

    await cargoPost.save();
    return NextResponse.json(cargoPost, { status: 201 });
  } catch (error) {
    console.error('Error creating cargo post:', error);
    return NextResponse.json(
      { error: 'Failed to create cargo post' },
      { status: 500 }
    );
  }
} 