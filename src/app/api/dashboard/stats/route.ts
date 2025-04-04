import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const User = mongoose.model('User');
    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const CargoPost = mongoose.model('CargoPost');
    const TruckPost = mongoose.model('TruckPost');

    // Kullanıcı rolüne göre filtreleme koşulları
    const userFilter = currentUser.role === 'admin' ? {} : { userId: currentUser._id };

    // Aktif ilanlar
    const activeCargoPosts = await CargoPost.countDocuments({ 
      ...userFilter,
      status: 'active' 
    });
    
    const activeTruckPosts = await TruckPost.countDocuments({ 
      ...userFilter,
      status: 'active' 
    });

    // Tamamlanan ilanlar
    const completedCargoPosts = await CargoPost.countDocuments({ 
      ...userFilter,
      status: 'completed' 
    });
    
    const completedTruckPosts = await TruckPost.countDocuments({ 
      ...userFilter,
      status: 'completed' 
    });

    // Toplam ilanlar
    const totalCargoPosts = await CargoPost.countDocuments(userFilter);
    const totalTruckPosts = await TruckPost.countDocuments(userFilter);

    // Okunmamış mesajlar (şimdilik 0 olarak ayarlandı)
    const unreadMessages = 0;

    return NextResponse.json({
      activeCargoPosts,
      activeTruckPosts,
      completedCargoPosts,
      completedTruckPosts,
      totalCargoPosts,
      totalTruckPosts,
      unreadMessages
    });
    
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 