import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CargoPost } from '@/lib/models/cargo-post.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const post = await CargoPost.findById(params.id)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: 'Cargo post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      createdBy: post.createdBy ? {
        ...post.createdBy,
        _id: post.createdBy._id.toString()
      } : null
    });
  } catch (error) {
    console.error('Error fetching cargo post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const post = await CargoPost.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Cargo post not found' },
        { status: 404 }
      );
    }

    if (post.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const updatedPost = await CargoPost.findByIdAndUpdate(
      params.id,
      { ...data },
      { new: true }
    ).populate({
      path: 'createdBy',
      select: 'name email phone',
      model: 'User'
    });

    return NextResponse.json({
      ...updatedPost!.toObject(),
      _id: updatedPost!._id.toString(),
      createdAt: updatedPost!.createdAt?.toISOString(),
      updatedAt: updatedPost!.updatedAt?.toISOString(),
      createdBy: updatedPost!.createdBy ? {
        ...updatedPost!.createdBy,
        _id: updatedPost!.createdBy._id.toString()
      } : null
    });
  } catch (error) {
    console.error('Error updating cargo post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const post = await CargoPost.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Cargo post not found' },
        { status: 404 }
      );
    }

    if (post.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await CargoPost.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Cargo post deleted successfully' });
  } catch (error) {
    console.error('Error deleting cargo post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 