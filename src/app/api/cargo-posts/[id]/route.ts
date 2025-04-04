import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CargoPost } from '@/lib/models/cargo-post.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

interface RouteParams {
  params: {
    id: string;
  };
}

interface PopulatedCargoPost {
  _id: Types.ObjectId;
  loadingCity: string;
  loadingAddress: string;
  unloadingCity: string;
  unloadingAddress: string;
  loadingDate: Date;
  unloadingDate: Date;
  vehicleType: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  createdBy: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
  };
  weight?: number;
  volume?: number;
  price?: number;
  palletCount?: number;
  palletType?: string;
  createdAt: Date;
  updatedAt: Date;
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
      .lean() as PopulatedCargoPost | null;

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
    }).lean() as PopulatedCargoPost | null;

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Failed to update cargo post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...updatedPost,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt?.toISOString(),
      updatedAt: updatedPost.updatedAt?.toISOString(),
      createdBy: updatedPost.createdBy ? {
        ...updatedPost.createdBy,
        _id: updatedPost.createdBy._id.toString()
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