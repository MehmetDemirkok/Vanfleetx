import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { CargoPost } from '@/lib/models/cargo-post.model';
import { TruckPost } from '@/lib/models/truck-post.model';

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs';

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

    // Kullanıcının aktif ilanlarını say
    const activeCargoPosts = await CargoPost.countDocuments({
      createdBy: session.user.id,
      status: 'active'
    });

    const activeTruckPosts = await TruckPost.countDocuments({
      createdBy: session.user.id,
      status: 'active'
    });

    // Toplam taşıma sayısı (tamamlanmış ilanlar)
    const completedCargoPosts = await CargoPost.countDocuments({
      createdBy: session.user.id,
      status: 'completed'
    });

    const completedTruckPosts = await TruckPost.countDocuments({
      createdBy: session.user.id,
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