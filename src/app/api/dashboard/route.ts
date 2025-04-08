import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Activity } from '@/lib/models/activity.model';
import { CargoPost } from '@/lib/models/cargo-post.model';
import { TruckPost } from '@/lib/models/truck-post.model';
import { User } from '@/lib/models/user.model';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Kullanıcı rolüne göre filtreleme koşulları
    const userFilter = currentUser.role === 'admin' ? {} : { createdBy: currentUser._id };

    // Toplam yük ilanı sayısı (completed hariç)
    const totalCargoPosts = await CargoPost.countDocuments({
      ...userFilter,
      status: { $ne: 'completed' }
    });
    
    // Toplam araç ilanı sayısı (completed hariç)
    const totalTruckPosts = await TruckPost.countDocuments({
      ...userFilter,
      status: { $ne: 'completed' }
    });
    
    // Tamamlanan taşımalar artık gösterilmeyecek
    const completedShipments = 0;
    
    // Aktif kullanıcı sayısı (son 15 dakika içinde aktif olanlar)
    const activeUsers = await User.countDocuments({ 
      lastActive: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
    });
    
    // Son aktiviteler
    const activityFilter = currentUser.role === 'admin' 
      ? {} 
      : { userId: currentUser._id };

    const recentActivities = await Activity.find(activityFilter)
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();
    
    // Aylık istatistikler
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
    
    const monthlyCargoStats = await CargoPost.aggregate([
      {
        $match: {
          ...userFilter,
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'completed' }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    const monthlyTruckStats = await TruckPost.aggregate([
      {
        $match: {
          ...userFilter,
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'completed' }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    // Şehir bazlı istatistikler
    const cityStats = await CargoPost.aggregate([
      {
        $match: userFilter
      },
      {
        $group: {
          _id: "$destinationCity",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Aylık verileri formatla
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const formattedMonthlyData = [];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = monthNames[date.getMonth()];
      
      const cargoCount = monthlyCargoStats.find(stat => 
        stat._id.year === date.getFullYear() && stat._id.month === date.getMonth() + 1
      )?.count || 0;
      
      const truckCount = monthlyTruckStats.find(stat => 
        stat._id.year === date.getFullYear() && stat._id.month === date.getMonth() + 1
      )?.count || 0;
      
      formattedMonthlyData.unshift({
        name: monthName,
        yuk: cargoCount,
        arac: truckCount
      });
    }
    
    // Şehir verilerini formatla
    const formattedCityData = cityStats.map(stat => ({
      name: stat._id || 'Bilinmeyen',
      value: stat.count
    }));
    
    return NextResponse.json({
      summary: {
        totalCargoPosts,
        totalTruckPosts,
        completedShipments,
        activeUsers
      },
      monthlyData: formattedMonthlyData,
      cityData: formattedCityData,
      recentActivities,
      userRole: currentUser.role // Kullanıcı rolünü de gönder
    });
    
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 