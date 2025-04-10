import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TruckPost } from '@/lib/models/truck-post.model';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

interface MongoTruckPost {
  _id: mongoose.Types.ObjectId;
  title: string;
  currentLocation: string;
  destination: string;
  truckType: string;
  capacity: number;
  price: number;
  description: string;
  availableDate: Date;
  status: string;
  createdBy: mongoose.Types.ObjectId;
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
    const posts = await TruckPost.find(query)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      currentLocation: post.currentLocation,
      destination: post.destination,
      truckType: post.truckType,
      capacity: post.capacity,
      price: post.price,
      description: post.description,
      availableDate: post.availableDate.toISOString(),
      status: post.status,
      createdBy: post.createdBy ? {
        _id: post.createdBy._id.toString(),
        name: post.createdBy.name,
        email: post.createdBy.email,
        phone: post.createdBy.phone
      } : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Truck Posts API Error:', error);
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
    const requiredFields = ['title', 'currentLocation', 'destination', 'truckType', 'capacity', 'price', 'description', 'availableDate'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return NextResponse.json({ 
        error: `Eksik alanlar: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validate data types
    if (typeof body.capacity !== 'number' || isNaN(body.capacity) || body.capacity <= 0) {
      console.log('Invalid capacity:', body.capacity);
      return NextResponse.json({ 
        error: 'Kapasite pozitif bir sayı olmalıdır' 
      }, { status: 400 });
    }

    if (typeof body.price !== 'number' || isNaN(body.price) || body.price <= 0) {
      console.log('Invalid price:', body.price);
      return NextResponse.json({ 
        error: 'Fiyat pozitif bir sayı olmalıdır' 
      }, { status: 400 });
    }

    // Validate truck type
    const validTruckTypes = ['tir', 'kamyon', 'kamyonet', 'van', 'pickup'];
    if (!validTruckTypes.includes(body.truckType)) {
      console.log('Invalid truck type:', body.truckType);
      return NextResponse.json({ 
        error: 'Geçersiz araç tipi' 
      }, { status: 400 });
    }

    // Validate date
    const availableDate = new Date(body.availableDate);
    if (isNaN(availableDate.getTime())) {
      console.log('Invalid date:', body.availableDate);
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

    console.log('Connecting to database...');
    const db = await connectToDatabase();
    console.log('Database connected:', !!db);

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
    
    console.log('Saving post...');
    const savedPost = await newPost.save();
    console.log('Post saved successfully:', savedPost._id);
    
    const formattedPost = {
      ...savedPost.toObject(),
      _id: savedPost._id.toString(),
      createdAt: savedPost.createdAt.toISOString(),
      updatedAt: savedPost.updatedAt.toISOString()
    };
    
    return NextResponse.json(formattedPost);
  } catch (error: any) {
    console.error('Truck Post Creation Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.errors ? JSON.stringify(error.errors) : undefined
    });
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        error: `Doğrulama hatası: ${validationErrors.join(', ')}` 
      }, { status: 400 });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json({ 
        error: 'Bu ilan zaten mevcut' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: `İlan oluşturulurken bir hata oluştu: ${error.message}` 
    }, { status: 500 });
  }
} 