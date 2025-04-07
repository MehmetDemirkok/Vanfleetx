import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CargoPost } from '@/lib/models/cargo-post.model';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

interface ICargoPost {
  _id: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  loadingCity: string;
  unloadingCity: string;
  loadingDate: Date;
  unloadingDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const publicOnly = searchParams.get('public') === 'true';

    // Build query
    const query: any = {};
    if (userId) {
      query.createdBy = userId;
    }
    if (publicOnly) {
      query.status = 'active';
    }

    // Get posts with populated creator information
    const posts = await CargoPost.find(query)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      createdBy: post.createdBy ? {
        _id: post.createdBy._id.toString(),
        name: post.createdBy.name,
        email: post.createdBy.email,
        phone: post.createdBy.phone
      } : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    })));
  } catch (error) {
    console.error('Cargo Posts API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.loadingCity || !body.unloadingCity || !body.loadingDate) {
      return NextResponse.json({ 
        error: 'Eksik bilgi: Yükleme şehri, boşaltma şehri ve yükleme tarihi zorunludur' 
      }, { status: 400 });
    }

    // Parse dates
    const loadingDate = new Date(body.loadingDate);
    if (isNaN(loadingDate.getTime())) {
      return NextResponse.json({ 
        error: 'Geçersiz yükleme tarihi' 
      }, { status: 400 });
    }

    // Create new post
    const newPost = new CargoPost({
      loadingCity: body.loadingCity,
      loadingAddress: body.loadingAddress,
      unloadingCity: body.unloadingCity,
      unloadingAddress: body.unloadingAddress,
      loadingDate: loadingDate,
      unloadingDate: body.unloadingDate ? new Date(body.unloadingDate) : loadingDate,
      vehicleType: body.vehicleType || 'tir',
      description: body.description,
      weight: Number(body.weight),
      volume: Number(body.volume),
      price: Number(body.price),
      palletCount: body.palletCount ? Number(body.palletCount) : undefined,
      palletType: body.palletType,
      createdBy: session.user.id,
      status: 'active'
    });

    const savedPost = await newPost.save();

    // Populate creator information
    const populatedPost = await CargoPost.findById(savedPost._id)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .lean();

    return NextResponse.json({
      ...populatedPost,
      _id: populatedPost._id.toString(),
      createdBy: populatedPost.createdBy ? {
        _id: populatedPost.createdBy._id.toString(),
        name: populatedPost.createdBy.name,
        email: populatedPost.createdBy.email,
        phone: populatedPost.createdBy.phone
      } : null,
      createdAt: populatedPost.createdAt.toISOString(),
      updatedAt: populatedPost.updatedAt.toISOString()
    });
  } catch (error: any) {
    console.error('Cargo Post Creation Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        error: `Doğrulama hatası: ${validationErrors.join(', ')}` 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: `İlan oluşturulurken bir hata oluştu: ${error.message}` 
    }, { status: 500 });
  }
} 