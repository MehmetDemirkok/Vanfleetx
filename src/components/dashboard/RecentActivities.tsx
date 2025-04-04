import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle, User } from 'lucide-react';

interface Activity {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  type: 'yuk' | 'arac' | 'onay' | 'kullanici';
  timestamp: string;
  details?: any;
}

const getIcon = (type: Activity['type']) => {
  switch (type) {
    case 'yuk':
      return <Package className="h-4 w-4" />;
    case 'arac':
      return <Truck className="h-4 w-4" />;
    case 'onay':
      return <CheckCircle className="h-4 w-4" />;
    case 'kullanici':
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Az önce';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} dakika önce`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} saat önce`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)} gün önce`;
  }
};

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son İşlemler</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.userName} {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Henüz hiç aktivite kaydı bulunmuyor.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 