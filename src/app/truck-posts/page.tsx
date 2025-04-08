'use client';

import { useState, useEffect, Suspense } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, TruckIcon, InfoIcon, PhoneIcon, RefreshCwIcon, ChevronDownIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchFilters } from "@/components/shared/search-filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  InformationCircleIcon, 
  ArrowPathIcon,
  ArrowLongRightIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';

interface TruckPost {
  _id: string;
  title: string;
  currentLocation: string;
  destination: string;
  availableDate: string;
  truckType: string;
  capacity: number;
  description?: string;
  price?: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdBy: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

type SortField = 'date' | 'route' | 'status';
type SortOrder = 'asc' | 'desc';

const maskName = (name: string | undefined): string => {
  if (!name) return 'İsim Belirtilmemiş';
  const nameParts = name.split(' ');
  if (nameParts.length < 2) return `${name.substring(0, 2)}${'*'.repeat(name.length - 2)}`;
  
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  const maskedFirstName = `${firstName.substring(0, 2)}${'*'.repeat(firstName.length - 2)}`;
  const maskedLastName = `${lastName.substring(0, 2)}${'*'.repeat(lastName.length - 2)}`;
  
  return `${maskedFirstName} ${maskedLastName}`;
};

function TruckPostsContent() {
  const [posts, setPosts] = useState<TruckPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedPost, setSelectedPost] = useState<TruckPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const queryParams = new URLSearchParams(searchParams?.toString() || '');
      queryParams.set('public', 'true');
      
      const res = await fetch(`${baseUrl}/api/truck-posts?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });
        
      if (!res.ok) {
        throw new Error('Failed to fetch truck posts');
      }

      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching truck posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const handleRefresh = async () => {
    try {
      await fetchPosts();
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime()
        : new Date(b.availableDate).getTime() - new Date(a.availableDate).getTime();
    }
    if (sortField === 'route') {
      const routeA = `${a.currentLocation}-${a.destination}`;
      const routeB = `${b.currentLocation}-${b.destination}`;
      return sortOrder === 'asc' 
        ? routeA.localeCompare(routeB)
        : routeB.localeCompare(routeA);
    }
    if (sortField === 'status') {
      return sortOrder === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) {
        return 'Tarih Belirtilmemiş';
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Tarih Formatı Hatalı';
      }

      return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Tarih Formatı Hatalı';
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'Aktif',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500'
        };
      case 'pending':
        return {
          text: 'Beklemede',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500'
        };
      case 'completed':
        return {
          text: 'Tamamlandı',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          dotColor: 'bg-blue-500'
        };
      case 'cancelled':
        return {
          text: 'İptal Edildi',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        };
      default:
        return {
          text: 'Bilinmiyor',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const handleDetailClick = (post: TruckPost) => {
    if (!session) {
      alert('Bu bilgileri görüntülemek için giriş yapmalısınız.');
      router.push('/auth/signin');
      return;
    }
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleContactClick = (post: TruckPost) => {
    if (!session) {
      alert('İletişim bilgilerini görüntülemek için giriş yapmalısınız.');
      router.push('/auth/signin');
      return;
    }
    setSelectedPost(post);
    setIsContactModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Araç İlanları</h1>
            <Button asChild>
              <Link href="/truck-posts/new">Yeni İlan Ekle</Link>
            </Button>
          </div>
          <SearchFilters 
            baseUrl="/truck-posts"
            vehicleTypes={[
              { value: 'all', label: 'Tümü' },
              { value: 'tir', label: 'Tır' },
              { value: 'kamyon', label: 'Kamyon' },
              { value: 'kamyonet', label: 'Kamyonet' }
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
          <div className="mt-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Araç İlanları</h1>
            <Button asChild>
              <Link href="/truck-posts/new">Yeni İlan Ekle</Link>
            </Button>
          </div>
          <SearchFilters 
            baseUrl="/truck-posts"
            vehicleTypes={[
              { value: 'all', label: 'Tümü' },
              { value: 'tir', label: 'Tır' },
              { value: 'kamyon', label: 'Kamyon' },
              { value: 'kamyonet', label: 'Kamyonet' }
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <TruckIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Henüz İlan Bulunmuyor</h3>
            <p className="text-muted-foreground mb-4">
              Şu anda aktif araç ilanı bulunmamaktadır.
            </p>
            <Button asChild>
              <Link href="/truck-posts/new">İlk İlanı Oluştur</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Araç İlanları</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
            <Link
              href="/truck-posts/new"
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-[#364fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
            >
              Yeni İlan
            </Link>
          </div>
        </div>

        <SearchFilters 
          baseUrl="/truck-posts"
          vehicleTypes={[
            { value: 'all', label: 'Tümü' },
            { value: 'tir', label: 'Tır' },
            { value: 'kamyon', label: 'Kamyon' },
            { value: 'kamyonet', label: 'Kamyonet' }
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

        <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <button
                    className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => handleSort('route')}
                  >
                    Güzergah
                    <ChevronDownIcon className={`ml-1 h-4 w-4 ${sortField === 'route' ? 'transform rotate-180' : ''}`} />
                  </button>
                </TableHead>
                <TableHead className="w-[200px]">
                  <button
                    className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => handleSort('date')}
                  >
                    Tarih
                    <ChevronDownIcon className={`ml-1 h-4 w-4 ${sortField === 'date' ? 'transform rotate-180' : ''}`} />
                  </button>
                </TableHead>
                <TableHead className="w-[150px]">Araç Tipi</TableHead>
                <TableHead className="w-[100px]">İlan Sahibi</TableHead>
                <TableHead className="w-[100px]">
                  <button
                    className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => handleSort('status')}
                  >
                    Durum
                    <ChevronDownIcon className={`ml-1 h-4 w-4 ${sortField === 'status' ? 'transform rotate-180' : ''}`} />
                  </button>
                </TableHead>
                <TableHead className="w-[100px]">Fiyat</TableHead>
                <TableHead className="w-[100px] text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.map((post) => {
                const statusInfo = getStatusInfo(post.status);
                return (
                  <TableRow key={post._id} className="hover:bg-gray-50">
                    <TableCell className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-900">{post.currentLocation}</span>
                        <ArrowLongRightIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-900">{post.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                        <div className="text-xs text-gray-900">{formatDate(post.availableDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                        <div>
                          <div className="text-xs text-gray-900">{post.truckType}</div>
                          <div className="text-[10px] text-gray-500">{post.capacity} ton</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-xs text-gray-900">{maskName(post.createdBy?.name)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor} mr-1`}></span>
                        {statusInfo.text}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                      {post.price ? `${post.price} ₺` : '-'}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-right text-xs font-medium">
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                Sayfa {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </nav>
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
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">İlan Sahibi</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {maskName(selectedPost.createdBy?.name)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Araç Tipi</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedPost.truckType} ({selectedPost.capacity} ton)
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fiyat</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedPost.price ? `${selectedPost.price} ₺` : '-'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Yükleme Bilgileri</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.currentLocation}</p>
              <p className="mt-1 text-sm text-gray-600">{formatDate(selectedPost.availableDate)}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Teslimat Bilgileri</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedPost.destination}</p>
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
                  {maskName(selectedPost.createdBy?.name)}
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
                  <span className="font-medium">Araç Tipi:</span> {selectedPost.truckType}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Kapasite:</span> {selectedPost.capacity} ton
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Konum:</span> {selectedPost.currentLocation}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Hedef:</span> {selectedPost.destination}
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

export default function TruckPostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TruckPostsContent />
    </Suspense>
  );
} 