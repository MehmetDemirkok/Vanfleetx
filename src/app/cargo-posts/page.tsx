'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MapPinIcon, TruckIcon, CalendarIcon, PhoneIcon, InformationCircleIcon, ArrowPathIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { SearchFilters } from "@/components/shared/search-filters";

interface CargoPost {
  _id: string;
  title: string;
  loadingCity: string;
  unloadingCity: string;
  loadingDate: string;
  cargoType: string;
  description: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  loadingAddress: string;
  unloadingAddress: string;
  weight: string;
  volume: string;
  price: string;
  createdBy: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function CargoPostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<CargoPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<CargoPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/cargo-posts${searchParams ? `?${searchParams.toString()}` : ''}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Kargo tipine göre Türkçe karşılık
  const getCargoTypeText = (type: string) => {
    const types: Record<string, string> = {
      'palet': 'Palet',
      'koli': 'Koli',
      'konteyner': 'Konteyner',
      'dökme': 'Dökme Yük',
      'parsiyel': 'Parsiyel'
    };
    return types[type] || type;
  };

  // Duruma göre stil ve metin
  const getStatusInfo = (status: CargoPost['status']) => {
    const statusMap = {
      'active': {
        text: 'Aktif',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-400'
      },
      'pending': {
        text: 'Beklemede',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        dotColor: 'bg-yellow-400'
      },
      'completed': {
        text: 'Tamamlandı',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-400'
      },
      'cancelled': {
        text: 'İptal Edildi',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        dotColor: 'bg-red-400'
      }
    };
    return statusMap[status];
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDetailClick = (post: CargoPost) => {
    if (!session) {
      alert('Bu bilgileri görüntülemek için giriş yapmalısınız.');
      router.push('/auth/signin');
      return;
    }
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleContactClick = (post: CargoPost) => {
    if (!session) {
      alert('İletişim bilgilerini görüntülemek için giriş yapmalısınız.');
      router.push('/auth/signin');
      return;
    }
    setSelectedPost(post);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Yük İlanları</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPosts}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
            <Link
              href="/cargo-posts/new"
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-[#364fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
            >
              Yeni İlan
            </Link>
          </div>
        </div>

        {/* Search Filters */}
        <SearchFilters 
          baseUrl="/cargo-posts"
          vehicleTypes={[
            { value: 'all', label: 'Tümü' },
            { value: 'palet', label: 'Palet' },
            { value: 'koli', label: 'Koli' },
            { value: 'konteyner', label: 'Konteyner' },
            { value: 'dökme', label: 'Dökme Yük' },
            { value: 'parsiyel', label: 'Parsiyel' }
          ]}
          statusOptions={[
            { value: 'all', label: 'Tümü' },
            { value: 'active', label: 'Aktif' },
            { value: 'pending', label: 'Beklemede' },
            { value: 'completed', label: 'Tamamlandı' },
            { value: 'cancelled', label: 'İptal Edildi' }
          ]}
          searchPlaceholder="Konum ara..."
        />

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                    Güzergah
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresler
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yük Bilgisi
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center text-xs text-gray-500">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center text-xs text-gray-500">
                      Henüz ilan bulunmuyor
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => {
                    const statusInfo = getStatusInfo(post.status);
                    return (
                      <tr key={post._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-900">{post.loadingCity}</span>
                            <ArrowLongRightIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-900">{post.unloadingCity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-[10px] text-green-800">Y</span>
                              </div>
                              <div className="ml-1.5">
                                <div className="text-xs text-gray-900">{post.loadingAddress}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="text-[10px] text-red-800">B</span>
                              </div>
                              <div className="ml-1.5">
                                <div className="text-xs text-gray-900">{post.unloadingAddress}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            <div className="text-xs text-gray-900">{formatDate(post.loadingDate)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <TruckIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            <div>
                              <div className="text-xs text-gray-900">{getCargoTypeText(post.cargoType)}</div>
                              <div className="text-[10px] text-gray-500 max-w-[200px] truncate">
                                {post.description || 'Açıklama bulunmuyor'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor} mr-1`}></span>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleDetailClick(post)}
                              className="text-gray-400 hover:text-gray-500"
                              title="Detaylar"
                            >
                              <InformationCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleContactClick(post)}
                              className="text-gray-400 hover:text-gray-500"
                              title="İletişim"
                            >
                              <PhoneIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="İlan Detayları"
      >
        {selectedPost && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Yük Bilgileri</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {getCargoTypeText(selectedPost.cargoType)}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedPost.weight} kg / {selectedPost.volume} m³
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fiyat</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedPost.price} ₺
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Yükleme Bilgileri</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.loadingCity}</p>
              <p className="mt-1 text-sm text-gray-600">{selectedPost.loadingAddress}</p>
              <p className="mt-1 text-sm text-gray-600">{formatDate(selectedPost.loadingDate)}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Teslimat Bilgileri</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.unloadingCity}</p>
              <p className="mt-1 text-sm text-gray-600">{selectedPost.unloadingAddress}</p>
            </div>

            {selectedPost.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Açıklama</h4>
                <p className="mt-1 text-sm text-gray-600">{selectedPost.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="İletişim Bilgileri"
      >
        {selectedPost && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">İlan Sahibi</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.createdBy.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">E-posta</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.createdBy.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Telefon</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.createdBy.phone || 'Belirtilmemiş'}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="px-4 py-2 bg-[#4263eb] text-white rounded-md hover:bg-[#364fc7] text-sm font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 