'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  TruckIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

interface CargoPost {
  _id: string;
  title: string;
  loadingLocation: string;
  deliveryLocation: string;
  cargoType: string;
  weight: number;
  volume: number;
  loadingDate: string;
  deliveryDate: string;
  price: number;
  status: string;
  createdAt: string;
}

export default function CargoPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CargoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cargoType: '',
    status: '',
    dateRange: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc' as 'asc' | 'desc'
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/cargo-posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'İlanlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSort = (key: keyof CargoPost) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredPosts = posts
    .filter(post => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (post.title?.toLowerCase() || '').includes(searchTermLower) ||
        (post.loadingLocation?.toLowerCase() || '').includes(searchTermLower) ||
        (post.deliveryLocation?.toLowerCase() || '').includes(searchTermLower);

      const matchesCargoType = !filters.cargoType || post.cargoType === filters.cargoType;
      const matchesStatus = !filters.status || post.status === filters.status;

      let matchesDateRange = true;
      if (filters.dateRange) {
        const postDate = new Date(post.createdAt);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            matchesDateRange = postDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            matchesDateRange = postDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            matchesDateRange = postDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesCargoType && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'title' || sortConfig.key === 'cargoType' || 
          sortConfig.key === 'status' || sortConfig.key === 'loadingLocation' || 
          sortConfig.key === 'deliveryLocation') {
        return sortConfig.direction === 'asc'
          ? (a[sortConfig.key] as string).localeCompare(b[sortConfig.key] as string)
          : (b[sortConfig.key] as string).localeCompare(a[sortConfig.key] as string);
      }
      
      if (sortConfig.key === 'price' || sortConfig.key === 'weight' || sortConfig.key === 'volume') {
        return sortConfig.direction === 'asc'
          ? (a[sortConfig.key] as number) - (b[sortConfig.key] as number)
          : (b[sortConfig.key] as number) - (a[sortConfig.key] as number);
      }

      // Tarihler için
      if (sortConfig.key === 'loadingDate' || sortConfig.key === 'deliveryDate' || sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc'
          ? new Date(a[sortConfig.key]).getTime() - new Date(b[sortConfig.key]).getTime()
          : new Date(b[sortConfig.key]).getTime() - new Date(a[sortConfig.key]).getTime();
      }

      return 0;
    });

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Az önce';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} gün önce`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} hafta önce`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ay önce`;
    }

    return past.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4263eb]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Yük İlanları</h1>
        <button
          onClick={() => router.push('/cargo-posts/new')}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Yeni İlan Oluştur
        </button>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Konum veya ilan ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div>
            <select
              value={filters.cargoType}
              onChange={(e) => setFilters({ ...filters, cargoType: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Yük Tipi</option>
              <option value="palet">Palet</option>
              <option value="koli">Koli</option>
              <option value="dökme">Dökme</option>
              <option value="konteyner">Konteyner</option>
            </select>
          </div>

          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Durum</option>
              <option value="active">Aktif</option>
              <option value="pending">Beklemede</option>
              <option value="completed">Tamamlandı</option>
            </select>
          </div>

          <div>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tarih Aralığı</option>
              <option value="today">Bugün</option>
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* İlan Tablosu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>İlan Detayları</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('cargoType')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Yük Bilgileri</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('loadingDate')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Tarihler</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Fiyat</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Durum</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{post.title}</span>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{post.loadingLocation} → {post.deliveryLocation}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm text-gray-900">
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{post.cargoType}</span>
                      </div>
                      <span className="text-gray-500 mt-1">
                        {post.weight} kg • {post.volume} m³
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>Yükleme: {new Date(post.loadingDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>Teslimat: {new Date(post.deliveryDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{post.price.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/cargo-posts/${post._id}`)}
                      className="text-[#4263eb] hover:text-blue-700"
                    >
                      Detaylar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 