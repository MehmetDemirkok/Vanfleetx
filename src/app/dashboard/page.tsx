'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  TruckIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  BellIcon,
  EnvelopeIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  activePosts: number;
  totalShipments: number;
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
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  type: 'cargo' | 'truck';
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activitiesResponse, postsResponse] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/activities'),
          fetch('/api/truck-posts')
        ]);

        if (!statsResponse.ok || !activitiesResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();
        const postsData = await postsResponse.json();

        setStats(statsData);
        setActivities(activitiesData);
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const handleEdit = (postId: string) => {
    router.push(`/dashboard/edit-post/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/truck-posts?id=${postId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete post');
        }

        // İlanı listeden kaldır
        setPosts(posts.filter(post => post._id !== postId));
        
        // İstatistikleri güncelle
        if (stats) {
          setStats({
            ...stats,
            activePosts: stats.activePosts - 1
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'İlan silinirken bir hata oluştu');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4263eb]"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const statsData = [
    { name: 'Aktif İlanlarım', value: stats?.activePosts || '0', icon: TruckIcon },
    { name: 'Toplam Taşıma', value: stats?.totalShipments || '0', icon: ArchiveBoxIcon },
    { name: 'Ortalama Puan', value: '4.8', icon: StarIcon },
    { name: 'Okunmamış Mesaj', value: stats?.unreadMessages || '0', icon: EnvelopeIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Hoş Geldin, {session.user?.name || 'Kullanıcı'}
            </h1>
            <p className="text-gray-600 mt-1">
              İlanlarını ve aktivitelerini buradan takip edebilirsin
            </p>
          </div>
          <Link
            href="/dashboard/create-post"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni İlan Oluştur
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-[#4263eb]" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* İlanlarım */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">İlanlarım</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İlan Başlığı
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === 'active' ? 'bg-green-100 text-green-800' :
                          post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status === 'active' ? 'Aktif' :
                           post.status === 'pending' ? 'Beklemede' :
                           'Tamamlandı'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(post._id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          disabled={isDeleting}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeleting}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Son Aktiviteler</h2>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== activities.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  activity.status === 'success'
                                    ? 'bg-green-500'
                                    : activity.status === 'ongoing'
                                    ? 'bg-blue-500'
                                    : 'bg-yellow-500'
                                }`}
                              >
                                <ChartBarIcon className="h-5 w-5 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <a href="#" className="font-medium text-gray-900">
                                    {activity.title}
                                  </a>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {activity.type} • {activity.date}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/activities')}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    Tüm Aktiviteleri Görüntüle
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Bildirimler</h2>
                  <span className="bg-[#4263eb] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stats?.unreadMessages || 0} Yeni
                  </span>
                </div>
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <BellIcon className="h-6 w-6 text-[#4263eb]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Henüz bildirim bulunmuyor
                          </p>
                          <p className="text-sm text-gray-500">
                            Yeni bildirimler burada görüntülenecek
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/notifications')}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    Tüm Bildirimleri Görüntüle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 