'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, TruckIcon, InfoIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
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

export default function TruckPostsPage() {
  const [posts, setPosts] = useState<TruckPost[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/truck-posts${searchParams ? `?${searchParams.toString()}` : ''}`);
        
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

    fetchPosts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Araç İlanları</h1>
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
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4263eb] mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Araç İlanları</h1>
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
        <div className="text-center text-muted-foreground">
          Henüz ilan bulunmamaktadır.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Araç İlanları</h1>
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

      <div className="rounded-md border mt-6">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Güzergah</TableHead>
                <TableHead>Adresler</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="font-medium">
                    {post.currentCity} - {post.destinationCity}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-green-600">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="text-xs">M</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mevcut Konum: {post.currentAddress}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-red-600">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="text-xs">H</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hedef: {post.destinationAddress}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <CalendarIcon className="w-4 h-4 text-[#4263eb]" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Müsait Tarih: {new Date(post.availableDate).toLocaleDateString("tr-TR")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          <TruckIcon className="w-4 h-4 text-gray-600" />
                          <span>{post.truckType} ({post.capacity} ton)</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{post.truckType} ({post.capacity} ton)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={post.status === "active" ? "success" : post.status === "completed" ? "default" : "secondary"}
                      className="w-2 h-2 rounded-full p-0"
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
} 