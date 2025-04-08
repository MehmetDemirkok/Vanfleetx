import { Activity } from '@/lib/models/activity.model';
import { connectToDatabase } from '@/lib/db';

interface LogActivityParams {
  userId: string;
  userName: string;
  action: string;
  type: 'yuk' | 'arac' | 'onay' | 'kullanici';
  details?: Record<string, any>;
}

export async function logActivity({
  userId,
  userName,
  action,
  type,
  details = {}
}: LogActivityParams) {
  try {
    await connectToDatabase();
    
    const activity = new Activity({
      userId,
      userName,
      action,
      type,
      details,
      timestamp: new Date()
    });
    
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Activity logging error:', error);
    throw error;
  }
}

// Örnek aktivite mesajları
export const ActivityMessages = {
  cargo: {
    created: 'yeni bir yük ilanı oluşturdu',
    updated: 'yük ilanını güncelledi',
    deleted: 'yük ilanını sildi',
    completed: 'yük taşımasını tamamladı'
  },
  truck: {
    created: 'yeni bir araç ilanı oluşturdu',
    updated: 'araç ilanını güncelledi',
    deleted: 'araç ilanını sildi',
    completed: 'araç taşımasını tamamladı'
  },
  user: {
    login: 'sisteme giriş yaptı',
    logout: 'sistemden çıkış yaptı',
    updated: 'profilini güncelledi'
  }
}; 