'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role && !allowedRoles.includes(session.user.role)) {
      toast.error('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
      router.push('/dashboard');
    }
  }, [session, allowedRoles, router]);

  if (!session?.user?.role) {
    return null;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return null;
  }

  return <>{children}</>;
} 