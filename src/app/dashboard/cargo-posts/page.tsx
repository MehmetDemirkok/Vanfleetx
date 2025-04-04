'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { columns } from './columns';
import { useCargoPosts } from '@/hooks/use-cargo-posts';

export default function DashboardCargoPosts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const { data: cargoPosts, isLoading, error } = useCargoPosts({ 
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

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Yük İlanlarım</h2>
        <Link href="/cargo-posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni İlan
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={cargoPosts || []}
      />
    </div>
  );
} 