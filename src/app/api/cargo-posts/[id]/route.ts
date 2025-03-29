import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { CargoPost } from '@/models/CargoPost';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const cargoPost = await CargoPost.findById(params.id);
    
    if (!cargoPost) {
      return NextResponse.json(
        { error: 'Cargo post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(cargoPost);
  } catch (error) {
    console.error('Error fetching cargo post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cargo post' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    await connectToDatabase();
    const cargoPost = await CargoPost.findById(params.id);

    if (!cargoPost) {
      return NextResponse.json(
        { error: 'Cargo post not found' },
        { status: 404 }
      );
    }

    if (cargoPost.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedCargoPost = await CargoPost.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updatedCargoPost);
  } catch (error) {
    console.error('Error updating cargo post:', error);
    return NextResponse.json(
      { error: 'Failed to update cargo post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await connectToDatabase();
    const cargoPost = await CargoPost.findById(params.id);

    if (!cargoPost) {
      return NextResponse.json(
        { error: 'Cargo post not found' },
        { status: 404 }
      );
    }

    if (cargoPost.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await CargoPost.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Cargo post deleted successfully' });
  } catch (error) {
    console.error('Error deleting cargo post:', error);
    return NextResponse.json(
      { error: 'Failed to delete cargo post' },
      { status: 500 }
    );
  }
} 