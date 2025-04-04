'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { columns } from './columns';
import { useTruckPosts } from '@/hooks/use-truck-posts';

export default function DashboardTruckPosts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const { data: truckPosts, isLoading, error } = useTruckPosts({ 
    userId: session?.user?.id 
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Bir hata oluştu. Lütfen tekrar deneyin.</p>
      </div>
    );
  }

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Araç İlanlarım</h2>
        <Link href="/truck-posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni İlan
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={truckPosts || []}
      />
    </div>
  );
} 