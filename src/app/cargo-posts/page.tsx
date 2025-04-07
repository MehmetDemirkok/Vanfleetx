'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MapPinIcon, TruckIcon, CalendarIcon, PhoneIcon, InformationCircleIcon, MagnifyingGlassIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';

interface CargoPost {
  _id: string;
  loadingCity: string;
  unloadingCity: string;
  loadingDate: string;
  unloadingDate: string;
  vehicleType: string;
  status: string;
  description?: string;
  weight?: number;
  volume?: number;
  price?: number;
  createdBy: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
}

function CargoPostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<CargoPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<CargoPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleType, setVehicleType] = useState('Tümü');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    fetchPosts();
  }, [searchParams, searchQuery, vehicleType, status]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (vehicleType !== 'Tümü') queryParams.append('vehicleType', vehicleType);
      if (status) queryParams.append('status', status);

      const response = await fetch(`/api/cargo-posts?${queryParams.toString()}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Yük İlanları</h1>
          <Link
            href="/cargo-posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-[#364fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
          >
            Yeni İlan Ekle
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Konum ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm rounded-md"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option>Tümü</option>
            <option>Tır</option>
            <option>Kamyon</option>
            <option>Kamyonet</option>
          </select>

          <select
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm rounded-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Aktif</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Henüz ilan bulunmuyor</h3>
            <p className="mt-2 text-sm text-gray-500">
              İlk ilanı oluşturarak başlayabilirsiniz.
            </p>
            <div className="mt-6">
              <Link
                href="/cargo-posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-[#364fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
              >
                İlk İlanı Oluştur
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Güzergah
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yükleme Tarihi
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Araç Tipi
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-xs text-gray-900">{post.loadingCity} → {post.unloadingCity}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center text-xs">
                        <CalendarIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-gray-900">{new Date(post.loadingDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-xs text-gray-900">{post.vehicleType}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${
                        post.status === 'active' ? 'bg-green-100 text-green-800' :
                        post.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {post.status === 'active' ? 'Aktif' :
                         post.status === 'completed' ? 'Tamamlandı' :
                         'İptal Edildi'}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                      {post.price ? `${post.price} ₺` : '-'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => handleDetailClick(post)}
                          className="text-[#4263eb] hover:text-[#364fc7]"
                        >
                          <InformationCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleContactClick(post)}
                          className="text-[#4263eb] hover:text-[#364fc7]"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                  {selectedPost.vehicleType}
                </p>
                {selectedPost.weight && (
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedPost.weight} kg
                  </p>
                )}
                {selectedPost.volume && (
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedPost.volume} m³
                  </p>
                )}
              </div>
              {selectedPost.price && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fiyat</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPost.price} ₺
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Yükleme Bilgileri</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.loadingCity}</p>
              <p className="mt-1 text-sm text-gray-600">
                {new Date(selectedPost.loadingDate).toLocaleDateString('tr-TR')}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Teslimat Bilgileri</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.unloadingCity}</p>
              <p className="mt-1 text-sm text-gray-600">
                {new Date(selectedPost.unloadingDate).toLocaleDateString('tr-TR')}
              </p>
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
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">İlan Sahibi</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-900 font-medium">
                  {selectedPost.createdBy?.name || 'İsim Belirtilmemiş'}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span>{selectedPost.createdBy?.email || 'E-posta Belirtilmemiş'}</span>
                </div>
                {selectedPost.createdBy?.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{selectedPost.createdBy.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">İlan Bilgileri</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Araç Tipi:</span> {selectedPost.vehicleType}
                </p>
                {selectedPost.weight && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Ağırlık:</span> {selectedPost.weight} kg
                  </p>
                )}
                {selectedPost.volume && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Hacim:</span> {selectedPost.volume} m³
                  </p>
                )}
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Yükleme:</span> {selectedPost.loadingCity}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Boşaltma:</span> {selectedPost.unloadingCity}
                </p>
                {selectedPost.price && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Fiyat:</span> {selectedPost.price} ₺
                  </p>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>İlan Tarihi: {new Date(selectedPost.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function CargoPostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CargoPostsContent />
    </Suspense>
  );
} 