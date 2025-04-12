import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CargoPost } from '@/lib/models/cargo-post.model';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface ICargoPost {
  _id: string;
  loadingCity: string;
  loadingAddress: string;
  unloadingCity: string;
  unloadingAddress: string;
  loadingDate: Date;
  unloadingDate: Date;
  vehicleType: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  createdBy: IUser | string;
  weight?: number;
  volume?: number;
  price?: number;
  palletCount?: number;
  palletType?: string;
  createdAt: Date;
  updatedAt: Date;
}

type MongoDBDocument = {
  _id: mongoose.Types.ObjectId;
  [key: string]: any;
};

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

    return NextResponse.json((posts as MongoDBDocument[]).map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdBy: post.createdBy ? {
        _id: (post.createdBy as MongoDBDocument)._id.toString(),
        name: (post.createdBy as any).name,
        email: (post.createdBy as any).email,
        phone: (post.createdBy as any).phone
      } : null,
      createdAt: new Date(post.createdAt).toISOString(),
      updatedAt: new Date(post.updatedAt).toISOString()
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
    if (!body.loadingCity || !body.unloadingCity || !body.loadingDate || !body.vehicleType) {
      return NextResponse.json({ 
        error: 'Eksik bilgi: Yükleme şehri, boşaltma şehri, yükleme tarihi ve araç tipi zorunludur' 
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
      loadingAddress: body.loadingAddress || '',
      unloadingCity: body.unloadingCity,
      unloadingAddress: body.unloadingAddress || '',
      loadingDate: loadingDate,
      unloadingDate: body.unloadingDate ? new Date(body.unloadingDate) : loadingDate,
      vehicleType: body.vehicleType,
      description: body.description,
      weight: body.weight ? Number(body.weight) : undefined,
      volume: body.volume ? Number(body.volume) : undefined,
      price: body.price ? Number(body.price) : undefined,
      palletCount: body.palletCount ? Number(body.palletCount) : undefined,
      palletType: body.palletType,
      status: 'active',
      createdBy: session.user.id
    });

    await newPost.save();

    // Populate the createdBy field
    const populatedPost = await CargoPost.findById(newPost._id)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .lean() as MongoDBDocument;

    if (!populatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...populatedPost,
      _id: populatedPost._id.toString(),
      createdBy: populatedPost.createdBy ? {
        _id: (populatedPost.createdBy as MongoDBDocument)._id.toString(),
        name: (populatedPost.createdBy as any).name,
        email: (populatedPost.createdBy as any).email,
        phone: (populatedPost.createdBy as any).phone
      } : null,
      createdAt: new Date(populatedPost.createdAt).toISOString(),
      updatedAt: new Date(populatedPost.updatedAt).toISOString()
    });
  } catch (error) {
    console.error('Cargo Posts API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 