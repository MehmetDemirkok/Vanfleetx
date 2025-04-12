import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TruckPost } from '@/lib/models/truck-post.model';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface ITruckPost {
  _id: string;
  title: string;
  currentLocation: string;
  destination: string;
  truckType: 'tir' | 'kamyon' | 'kamyonet' | 'van' | 'pickup';
  capacity: number;
  price: number;
  description: string;
  availableDate: Date;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  createdBy: IUser | string;
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
    const posts = await TruckPost.find(query)
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
      availableDate: new Date(post.availableDate).toISOString(),
      createdAt: new Date(post.createdAt).toISOString(),
      updatedAt: new Date(post.updatedAt).toISOString()
    })));
  } catch (error) {
    console.error('Truck Posts API Error:', error);
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
    const requiredFields = ['title', 'currentLocation', 'destination', 'truckType', 'capacity', 'price', 'description', 'availableDate'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Eksik alanlar: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validate data types
    if (typeof body.capacity !== 'number' || isNaN(body.capacity) || body.capacity <= 0) {
      return NextResponse.json({ 
        error: 'Kapasite pozitif bir sayı olmalıdır' 
      }, { status: 400 });
    }

    if (typeof body.price !== 'number' || isNaN(body.price) || body.price <= 0) {
      return NextResponse.json({ 
        error: 'Fiyat pozitif bir sayı olmalıdır' 
      }, { status: 400 });
    }

    // Validate truck type
    const validTruckTypes = ['tir', 'kamyon', 'kamyonet', 'van', 'pickup'] as const;
    if (!validTruckTypes.includes(body.truckType)) {
      return NextResponse.json({ 
        error: 'Geçersiz araç tipi' 
      }, { status: 400 });
    }

    // Validate date
    const availableDate = new Date(body.availableDate);
    if (isNaN(availableDate.getTime())) {
      return NextResponse.json({ 
        error: 'Geçersiz tarih formatı' 
      }, { status: 400 });
    }

    // Validate string fields
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Geçerli bir başlık giriniz' 
      }, { status: 400 });
    }

    if (typeof body.currentLocation !== 'string' || body.currentLocation.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Geçerli bir mevcut konum giriniz' 
      }, { status: 400 });
    }

    if (typeof body.destination !== 'string' || body.destination.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Geçerli bir hedef konum giriniz' 
      }, { status: 400 });
    }

    if (typeof body.description !== 'string' || body.description.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Geçerli bir açıklama giriniz' 
      }, { status: 400 });
    }

    await connectToDatabase();

    const newPost = new TruckPost({
      title: body.title.trim(),
      currentLocation: body.currentLocation.trim(),
      destination: body.destination.trim(),
      truckType: body.truckType,
      capacity: body.capacity,
      price: body.price,
      description: body.description.trim(),
      availableDate: availableDate,
      createdBy: session.user.id,
      status: 'active'
    });
    
    await newPost.save();

    // Populate the createdBy field
    const populatedPost = await TruckPost.findById(newPost._id)
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
      availableDate: new Date(populatedPost.availableDate).toISOString(),
      createdAt: new Date(populatedPost.createdAt).toISOString(),
      updatedAt: new Date(populatedPost.updatedAt).toISOString()
    });
  } catch (error) {
    console.error('Truck Post Creation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 