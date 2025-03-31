import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { TruckPost } from '@/lib/models/truck-post.model';

export async function GET(request: Request) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database successfully');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const vehicleType = searchParams.get('vehicleType');
    const status = searchParams.get('status');

    console.log('Search params:', { search, vehicleType, status });

    let query: any = {};

    if (search) {
      query.$or = [
        { currentLocation: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
      ];
    }

    if (vehicleType && vehicleType !== 'all') {
      query.truckType = vehicleType;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    const posts = await TruckPost.find(query)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${posts.length} posts`);

    const formattedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      createdBy: post.createdBy ? {
        ...post.createdBy,
        _id: post.createdBy._id.toString()
      } : null
    }));

    console.log('Returning formatted posts');
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching truck posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
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
    
    const postData = {
      title: data.title,
      currentLocation: data.currentLocation,
      destination: data.destination,
      truckType: data.truckType,
      capacity: parseFloat(data.capacity),
      status: 'active',
      createdBy: session.user.id
    };

    const post = await TruckPost.create(postData);

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
    console.error('Error creating truck post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 