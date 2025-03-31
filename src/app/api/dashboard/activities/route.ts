import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { CargoPost } from '@/lib/models/cargo-post.model';
import { TruckPost } from '@/lib/models/truck-post.model';
import { Document, Types } from 'mongoose';

interface BaseDocument extends Document {
  _id: Types.ObjectId;
  status: string;
  createdAt: Date;
}

interface CargoPostDocument extends BaseDocument {
  loadingCity: string;
  unloadingCity: string;
}

interface TruckPostDocument extends BaseDocument {
  title: string;
  currentLocation: string;
  destination: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Son 5 yük ilanı
    const recentCargoPosts = (await CargoPost.find({
      createdBy: session.user.id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('loadingCity unloadingCity status createdAt')
    .lean()) as unknown as CargoPostDocument[];

    // Son 5 araç ilanı
    const recentTruckPosts = (await TruckPost.find({
      createdBy: session.user.id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title currentLocation destination status createdAt')
    .lean()) as unknown as TruckPostDocument[];

    // Tüm ilanları birleştir ve tarihe göre sırala
    const allPosts = [
      ...recentCargoPosts.map(post => ({
        id: post._id.toString(),
        title: `${post.loadingCity} - ${post.unloadingCity}`,
        type: 'Yük İlanı',
        date: new Date(post.createdAt).toLocaleDateString('tr-TR'),
        status: post.status === 'completed' ? 'success' :
                post.status === 'active' ? 'ongoing' : 'pending'
      })),
      ...recentTruckPosts.map(post => ({
        id: post._id.toString(),
        title: `${post.currentLocation} - ${post.destination}`,
        type: 'Araç İlanı',
        date: new Date(post.createdAt).toLocaleDateString('tr-TR'),
        status: post.status === 'completed' ? 'success' :
                post.status === 'active' ? 'ongoing' : 'pending'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activities' },
      { status: 500 }
    );
  }
} 