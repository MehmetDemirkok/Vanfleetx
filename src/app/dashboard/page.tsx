'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

interface DashboardStats {
  activePosts: number;
  completedShipments: number;
  unreadMessages: number;
}

interface Activity {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'success' | 'ongoing' | 'pending';
}

interface Post {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'success' | 'ongoing' | 'pending';
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stats
        const statsResponse = await fetch('/api/dashboard/stats');
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch activities
        const activitiesResponse = await fetch('/api/dashboard/activities');
        if (!activitiesResponse.ok) throw new Error('Failed to fetch activities');
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);
        setPosts(activitiesData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Dashboard verilerini getirirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container max-w-6xl mx-auto p-4 space-y-6">
        {/* Logo ve Hoşgeldin Mesajı */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#4263eb]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="text-xl font-bold">VanFleetX</span>
          </div>
          <div className="flex flex-col items-end">
            <h1 className="text-2xl font-bold text-gray-900">
              Hoş Geldin, {session.user?.name}
            </h1>
            <p className="text-gray-600">
              İşte bugünkü istatistikler ve son aktivitelerin
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 bg-white border border-gray-200">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icons.post className="h-6 w-6 text-[#4263eb]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif İlanlar</p>
                  <h2 className="text-3xl font-bold text-gray-900">{stats?.activePosts || 0}</h2>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icons.check className="h-6 w-6 text-[#4263eb]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tamamlanan Taşımalar</p>
                  <h2 className="text-3xl font-bold text-gray-900">{stats?.completedShipments || 0}</h2>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icons.message className="h-6 w-6 text-[#4263eb]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Okunmamış Mesajlar</p>
                  <h2 className="text-3xl font-bold text-gray-900">{stats?.unreadMessages || 0}</h2>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activities */}
          <Card className="bg-white border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Son Aktiviteler</h2>
                <Button variant="ghost" size="sm" className="text-[#4263eb] hover:text-[#364fc7]">
                  Tümünü Gör
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-blue-50">
                          {activity.type === 'Yük İlanı' ? (
                            <Icons.post className="h-4 w-4 text-[#4263eb]" />
                          ) : (
                            <Icons.truck className="h-4 w-4 text-[#4263eb]" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium line-clamp-1 text-gray-900">{activity.title}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>{activity.type}</span>
                            <span className="mx-2">•</span>
                            <span>{activity.date}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          activity.status === 'success'
                            ? 'success'
                            : activity.status === 'ongoing'
                            ? 'default'
                            : 'secondary'
                        }
                        className="ml-2"
                      >
                        {activity.status === 'success'
                          ? 'Tamamlandı'
                          : activity.status === 'ongoing'
                          ? 'Devam Ediyor'
                          : 'Beklemede'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600">
                  Henüz aktivite bulunmuyor
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Hızlı İşlemler</h2>
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-start space-x-4 border-gray-200 hover:bg-gray-50"
                  onClick={() => router.push('/cargo-posts/new')}
                >
                  <div className="p-2 rounded-full bg-blue-50">
                    <Icons.plus className="h-4 w-4 text-[#4263eb]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Yeni Yük İlanı</span>
                    <span className="text-sm text-gray-600">Yük ilanı oluştur ve teklif al</span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-start space-x-4 border-gray-200 hover:bg-gray-50"
                  onClick={() => router.push('/truck-posts/new')}
                >
                  <div className="p-2 rounded-full bg-blue-50">
                    <Icons.plus className="h-4 w-4 text-[#4263eb]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Yeni Araç İlanı</span>
                    <span className="text-sm text-gray-600">Araç ilanı oluştur ve yük bul</span>
                  </div>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 