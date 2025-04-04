import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle, Users } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  loading?: boolean;
}

const SummaryCard = ({ title, value, icon, description, loading }: SummaryCardProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 text-muted-foreground">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface DashboardSummary {
  totalCargoPosts: number;
  totalTruckPosts: number;
  completedShipments: number;
  activeUsers: number;
}

interface DashboardData {
  summary: DashboardSummary;
  userRole: 'admin' | 'user';
}

export default function SummaryCards() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        }
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const isAdmin = data?.userRole === 'admin';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title={isAdmin ? "Toplam Yük İlanı" : "Yük İlanlarım"}
        value={data?.summary.totalCargoPosts || 0}
        icon={<Package className="h-4 w-4" />}
        description={isAdmin ? "Sistemdeki tüm yük ilanları" : "Oluşturduğunuz yük ilanları"}
        loading={loading}
      />
      <SummaryCard
        title={isAdmin ? "Toplam Araç İlanı" : "Araç İlanlarım"}
        value={data?.summary.totalTruckPosts || 0}
        icon={<Truck className="h-4 w-4" />}
        description={isAdmin ? "Sistemdeki tüm araç ilanları" : "Oluşturduğunuz araç ilanları"}
        loading={loading}
      />
      <SummaryCard
        title={isAdmin ? "Tamamlanan Taşımalar" : "Tamamlanan Taşımalarım"}
        value={data?.summary.completedShipments || 0}
        icon={<CheckCircle className="h-4 w-4" />}
        description={isAdmin ? "Tüm tamamlanan işler" : "Tamamladığınız işler"}
        loading={loading}
      />
      {isAdmin ? (
        <SummaryCard
          title="Aktif Kullanıcılar"
          value={data?.summary.activeUsers || 0}
          icon={<Users className="h-4 w-4" />}
          description="Şu an aktif olan kullanıcılar"
          loading={loading}
        />
      ) : (
        <SummaryCard
          title="Hesap Durumu"
          value={1}
          icon={<Users className="h-4 w-4" />}
          description="Aktif hesap"
          loading={loading}
        />
      )}
    </div>
  );
} 