import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const TruckPost = mongoose.model('TruckPost');

    const post = await TruckPost.findById(params.id);

    if (!post) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    // Check if user has permission to view this post
    if (session.user.role !== 'ADMIN' && post.userId !== session.user.id) {
      return NextResponse.json({ error: 'Bu ilana erişim izniniz yok' }, { status: 403 });
    }

    return NextResponse.json({
      ...post.toObject(),
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching truck post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();
    const TruckPost = mongoose.model('TruckPost');

    const post = await TruckPost.findById(params.id);

    if (!post) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    // Check if user has permission to edit this post
    if (session.user.role !== 'ADMIN' && post.userId !== session.user.id) {
      return NextResponse.json({ error: 'Bu ilanı düzenleme izniniz yok' }, { status: 403 });
    }

    const updatedPost = await TruckPost.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json({
      ...updatedPost.toObject(),
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating truck post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const TruckPost = mongoose.model('TruckPost');

    const post = await TruckPost.findById(params.id);

    if (!post) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    // Check if user has permission to delete this post
    if (session.user.role !== 'ADMIN' && post.userId !== session.user.id) {
      return NextResponse.json({ error: 'Bu ilanı silme izniniz yok' }, { status: 403 });
    }

    await TruckPost.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'İlan başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting truck post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 