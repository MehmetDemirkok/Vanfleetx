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

    // Kullanıcının aktif ilanlarını say
    const activeCargoPosts = await CargoPost.countDocuments({
      userId: session.user.id,
      status: 'active'
    });

    const activeTruckPosts = await TruckPost.countDocuments({
      userId: session.user.id,
      status: 'active'
    });

    // Toplam taşıma sayısı (tamamlanmış ilanlar)
    const completedCargoPosts = await CargoPost.countDocuments({
      userId: session.user.id,
      status: 'completed'
    });

    const completedTruckPosts = await TruckPost.countDocuments({
      userId: session.user.id,
      status: 'completed'
    });

    // Okunmamış mesaj sayısı (şimdilik sabit)
    const unreadMessages = 0;

    return NextResponse.json({
      activePosts: activeCargoPosts + activeTruckPosts,
      totalShipments: completedCargoPosts + completedTruckPosts,
      unreadMessages
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 