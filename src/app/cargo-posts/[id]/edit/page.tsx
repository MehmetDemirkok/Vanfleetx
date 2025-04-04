'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CargoPost {
  _id: string;
  loadingCity: string;
  loadingAddress: string;
  unloadingCity: string;
  unloadingAddress: string;
  loadingDate: string;
  unloadingDate: string;
  vehicleType: string;
  description?: string;
  status: string;
  weight?: number;
  volume?: number;
  price?: number;
  palletCount?: number;
  palletType?: string;
}

export default function EditCargoPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<CargoPost | null>(null);
  
  const [formData, setFormData] = useState({
    loadingCity: '',
    loadingAddress: '',
    unloadingCity: '',
    unloadingAddress: '',
    loadingDate: '',
    unloadingDate: '',
    vehicleType: '',
    description: '',
    status: '',
    weight: '',
    volume: '',
    price: '',
    palletCount: '',
    palletType: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      fetchCargoPost();
    }
  }, [id]);

  const fetchCargoPost = async () => {
    try {
      const response = await fetch(`/api/cargo-posts/${id}`);
      if (!response.ok) {
        throw new Error('İlan bulunamadı');
      }
      const data = await response.json();
      setPost(data);
      
      // Form verilerini doldur
      setFormData({
        loadingCity: data.loadingCity || '',
        loadingAddress: data.loadingAddress || '',
        unloadingCity: data.unloadingCity || '',
        unloadingAddress: data.unloadingAddress || '',
        loadingDate: data.loadingDate ? new Date(data.loadingDate).toISOString().split('T')[0] : '',
        unloadingDate: data.unloadingDate ? new Date(data.unloadingDate).toISOString().split('T')[0] : '',
        vehicleType: data.vehicleType || '',
        description: data.description || '',
        status: data.status || 'active',
        weight: data.weight ? data.weight.toString() : '',
        volume: data.volume ? data.volume.toString() : '',
        price: data.price ? data.price.toString() : '',
        palletCount: data.palletCount ? data.palletCount.toString() : '',
        palletType: data.palletType || '',
      });
    } catch (error) {
      console.error('Error fetching cargo post:', error);
      toast.error('İlan yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`/api/cargo-posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          volume: formData.volume ? parseFloat(formData.volume) : undefined,
          price: formData.price ? parseFloat(formData.price) : undefined,
          palletCount: formData.palletCount ? parseInt(formData.palletCount) : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('İlan güncellenirken bir hata oluştu');
      }
      
      toast.success('İlan başarıyla güncellendi');
      router.push('/dashboard/cargo-posts');
    } catch (error) {
      console.error('Error updating cargo post:', error);
      toast.error('İlan güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle>İlan Bulunamadı</CardTitle>
              <CardDescription>Düzenlemek istediğiniz yük ilanı bulunamadı.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push('/dashboard/cargo-posts')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri Dön
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/cargo-posts')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <h1 className="text-2xl font-bold">Yük İlanı Düzenle</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Yük İlanı Bilgileri</CardTitle>
            <CardDescription>Yük ilanı bilgilerini güncelleyebilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loadingCity">Yükleme Şehri</Label>
                  <Input
                    id="loadingCity"
                    name="loadingCity"
                    value={formData.loadingCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loadingAddress">Yükleme Adresi</Label>
                  <Input
                    id="loadingAddress"
                    name="loadingAddress"
                    value={formData.loadingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unloadingCity">Boşaltma Şehri</Label>
                  <Input
                    id="unloadingCity"
                    name="unloadingCity"
                    value={formData.unloadingCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unloadingAddress">Boşaltma Adresi</Label>
                  <Input
                    id="unloadingAddress"
                    name="unloadingAddress"
                    value={formData.unloadingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loadingDate">Yükleme Tarihi</Label>
                  <Input
                    id="loadingDate"
                    name="loadingDate"
                    type="date"
                    value={formData.loadingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unloadingDate">Boşaltma Tarihi</Label>
                  <Input
                    id="unloadingDate"
                    name="unloadingDate"
                    type="date"
                    value={formData.unloadingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Araç Tipi</Label>
                  <Select 
                    value={formData.vehicleType} 
                    onValueChange={(value) => handleSelectChange('vehicleType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Araç tipi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tir">TIR</SelectItem>
                      <SelectItem value="kamyon">Kamyon</SelectItem>
                      <SelectItem value="kamyonet">Kamyonet</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Ağırlık (ton)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="volume">Hacim (m³)</Label>
                  <Input
                    id="volume"
                    name="volume"
                    type="number"
                    value={formData.volume}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Fiyat (TL)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="palletCount">Palet Sayısı</Label>
                  <Input
                    id="palletCount"
                    name="palletCount"
                    type="number"
                    value={formData.palletCount}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="palletType">Palet Tipi</Label>
                  <Input
                    id="palletType"
                    name="palletType"
                    value={formData.palletType}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
} 