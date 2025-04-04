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

    // Get userId from query parameters if provided
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Build query based on whether userId is provided
    const query = userId ? { createdBy: userId } : {};

    // Get posts with optional filtering
    const posts = await CargoPost.find(query)
      .sort({ createdAt: -1 })
      .lean<ICargoPost[]>();

    return NextResponse.json(posts.map(post => ({
      ...post,
      _id: post._id.toString(),
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
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received body:', body);

    // Validate required fields
    const requiredFields = [
      'title',
      'loadingCity',
      'loadingAddress',
      'unloadingCity',
      'unloadingAddress',
      'loadingDate',
      'cargoType',
      'weight',
      'volume',
      'price'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return NextResponse.json({ 
        error: `Eksik alanlar: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validate data types
    if (isNaN(Number(body.weight)) || Number(body.weight) <= 0) {
      return NextResponse.json({ 
        error: 'Geçerli bir ağırlık değeri giriniz' 
      }, { status: 400 });
    }

    if (isNaN(Number(body.volume)) || Number(body.volume) <= 0) {
      return NextResponse.json({ 
        error: 'Geçerli bir hacim değeri giriniz' 
      }, { status: 400 });
    }

    if (isNaN(Number(body.price)) || Number(body.price) <= 0) {
      return NextResponse.json({ 
        error: 'Geçerli bir fiyat değeri giriniz' 
      }, { status: 400 });
    }

    // Validate dates
    const loadingDate = new Date(body.loadingDate);
    if (isNaN(loadingDate.getTime())) {
      return NextResponse.json({ 
        error: 'Geçerli bir yükleme tarihi giriniz' 
      }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Create new post
    const newPost = new CargoPost({
      title: body.title,
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

    console.log('Saving post:', newPost);
    const savedPost = await newPost.save();
    console.log('Post saved:', savedPost);

    return NextResponse.json({
      ...savedPost.toObject(),
      _id: savedPost._id.toString(),
      createdAt: savedPost.createdAt.toISOString(),
      updatedAt: savedPost.updatedAt.toISOString()
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