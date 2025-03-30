import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { CargoPost } from '@/lib/models/cargo-post.model';
import { Error as MongooseError } from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const vehicleType = searchParams.get('vehicleType');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange');

    let query: any = {};

    if (search) {
      query.$or = [
        { loadingCity: { $regex: search, $options: 'i' } },
        { unloadingCity: { $regex: search, $options: 'i' } },
        { loadingAddress: { $regex: search, $options: 'i' } },
        { unloadingAddress: { $regex: search, $options: 'i' } },
      ];
    }

    if (vehicleType && vehicleType !== 'all') {
      query.vehicleType = vehicleType;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let dateFilter: Date;

      switch (dateRange) {
        case 'today':
          dateFilter = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          dateFilter = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          dateFilter = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          dateFilter = new Date(0);
      }

      query.createdAt = { $gte: dateFilter };
    }

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
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      createdBy: post.createdBy ? {
        ...post.createdBy,
        _id: post.createdBy._id.toString()
      } : null
    })));
  } catch (error) {
    console.error('Error fetching cargo posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    
    // Form verilerini model şemasına uygun şekilde dönüştür
    const postData = {
      userId: session.user.id,
      loadingCity: data.loadingCity,
      loadingAddress: data.loadingAddress || data.loadingCity, // Eğer adres girilmemişse şehir adres olarak kullanılır
      unloadingCity: data.deliveryCity,
      unloadingAddress: data.unloadingAddress || data.deliveryCity, // Eğer adres girilmemişse şehir adres olarak kullanılır
      loadingDate: new Date(data.loadingDate),
      unloadingDate: new Date(data.loadingDate), // Şimdilik yükleme tarihi ile aynı
      vehicleType: data.cargoType,
      description: data.description,
      weight: data.weight ? parseFloat(data.weight) : undefined,
      volume: data.volume ? parseFloat(data.volume) : undefined,
      price: data.price ? parseFloat(data.price) : undefined,
      palletCount: data.palletCount ? parseInt(data.palletCount) : undefined,
      palletType: data.palletType,
      status: 'active',
      createdBy: session.user.id
    };

    const post = await CargoPost.create(postData);

    await post.populate({
      path: 'createdBy',
      select: 'name email phone',
      model: 'User'
    });

    return NextResponse.json({
      ...post.toObject(),
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      createdBy: post.createdBy ? {
        ...post.createdBy,
        _id: post.createdBy._id.toString()
      } : null
    });
  } catch (error) {
    console.error('Error creating cargo post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 