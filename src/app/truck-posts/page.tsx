'use client';

import { useState, useEffect } from 'react';
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

interface TruckPost {
  _id: string;
  currentCity: string;
  currentAddress: string;
  destinationCity: string;
  destinationAddress: string;
  availableDate: string;
  truckType: string;
  capacity: number;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
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

export default function TruckPostsPage() {
  const [posts, setPosts] = useState<TruckPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/truck-posts${searchParams ? `?${searchParams.toString()}` : ''}`, {
        cache: 'no-store'
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
      const routeA = `${a.currentCity}-${a.destinationCity}`;
      const routeB = `${b.currentCity}-${b.destinationCity}`;
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
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Geçersiz Tarih';
      }
      return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date).toString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Geçersiz Tarih';
    }
  };

  const getStatusInfo = (status: TruckPost['status']) => {
    const statusMap = {
      'active': {
        text: 'Aktif',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-400'
      },
      'completed': {
        text: 'Tamamlandı',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-400'
      },
      'inactive': {
        text: 'Pasif',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        dotColor: 'bg-gray-400'
      }
    };
    return statusMap[status];
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
              { value: 'inactive', label: 'Pasif' },
              { value: 'completed', label: 'Tamamlandı' }
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
              { value: 'inactive', label: 'Pasif' },
              { value: 'completed', label: 'Tamamlandı' }
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
            >
              <RefreshCwIcon className="w-4 h-4" />
              Yenile
            </Button>
            <Button
              size="sm"
              className="bg-[#4263eb] hover:bg-[#364fc7] text-white px-3 py-2 text-sm font-medium"
              asChild
            >
              <Link href="/truck-posts/new">Yeni İlan</Link>
            </Button>
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
            { value: 'inactive', label: 'Pasif' },
            { value: 'completed', label: 'Tamamlandı' }
          ]}
          searchPlaceholder="Konum ara..."
        />

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <TooltipProvider>
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
                      Araç Bilgisi
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
                  {paginatedPosts.map((post) => {
                    const statusInfo = getStatusInfo(post.status);
                    return (
                      <tr key={post._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-900">{post.currentCity}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-900">{post.destinationCity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-[10px] text-green-800">M</span>
                              </div>
                              <div className="ml-1.5">
                                <div className="text-xs text-gray-900">{post.currentAddress}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="text-[10px] text-red-800">H</span>
                              </div>
                              <div className="ml-1.5">
                                <div className="text-xs text-gray-900">{post.destinationAddress}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            <div className="text-xs text-gray-900">{formatDate(post.availableDate)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <TruckIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            <div>
                              <div className="text-xs text-gray-900">{post.truckType}</div>
                              <div className="text-[10px] text-gray-500">{post.capacity} ton</div>
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/truck-posts/${post._id}`}>
                                    <InfoIcon className="w-4 h-4" />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Detayları Gör</p>
                              </TooltipContent>
                            </Tooltip>

                            {post.createdBy && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/messages/${post.createdBy._id}`}>
                                      <PhoneIcon className="w-4 h-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>İletişime Geç</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TooltipProvider>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Önceki
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 