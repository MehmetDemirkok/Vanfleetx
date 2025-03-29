import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import CargoPost from '@/models/CargoPost';
import TruckPost from '@/models/TruckPost';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Son 5 yük ilanı
    const recentCargoPosts = await CargoPost.find({
      userId: session.user.id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status createdAt');

    // Son 5 araç ilanı
    const recentTruckPosts = await TruckPost.find({
      userId: session.user.id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status createdAt');

    // Tüm ilanları birleştir ve tarihe göre sırala
    const allPosts = [
      ...recentCargoPosts.map(post => ({
        id: post._id,
        title: post.title,
        type: post.status === 'completed' ? 'Tamamlandı' : 
              post.status === 'active' ? 'Devam Ediyor' : 'Beklemede',
        date: new Date(post.createdAt).toLocaleDateString('tr-TR'),
        status: post.status === 'completed' ? 'success' :
                post.status === 'active' ? 'ongoing' : 'pending'
      })),
      ...recentTruckPosts.map(post => ({
        id: post._id,
        title: post.title,
        type: post.status === 'completed' ? 'Tamamlandı' : 
              post.status === 'active' ? 'Devam Ediyor' : 'Beklemede',
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