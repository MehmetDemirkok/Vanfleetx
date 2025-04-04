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