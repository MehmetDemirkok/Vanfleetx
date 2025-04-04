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

interface TruckPost {
  _id: string;
  title: string;
  currentLocation: string;
  destination: string;
  truckType: string;
  capacity: number;
  availableDate: string;
  status: string;
  description?: string;
  price?: number;
  createdBy: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function EditTruckPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<TruckPost | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    currentLocation: '',
    destination: '',
    truckType: '',
    capacity: '',
    availableDate: '',
    status: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      fetchTruckPost();
    }
  }, [id]);

  const fetchTruckPost = async () => {
    try {
      const response = await fetch(`/api/truck-posts/${id}`);
      if (!response.ok) {
        throw new Error('İlan bulunamadı');
      }
      const data = await response.json();
      setPost(data);
      
      // Form verilerini doldur
      setFormData({
        title: data.title || '',
        currentLocation: data.currentLocation || '',
        destination: data.destination || '',
        truckType: data.truckType || '',
        capacity: data.capacity ? data.capacity.toString() : '',
        availableDate: data.availableDate ? new Date(data.availableDate).toISOString().split('T')[0] : '',
        status: data.status || 'active',
        description: data.description || '',
        price: data.price ? data.price.toString() : '',
      });
    } catch (error) {
      console.error('Error fetching truck post:', error);
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
      const response = await fetch(`/api/truck-posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseFloat(formData.capacity) : undefined,
          price: formData.price ? parseFloat(formData.price) : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('İlan güncellenirken bir hata oluştu');
      }
      
      toast.success('İlan başarıyla güncellendi');
      router.push('/dashboard/truck-posts');
    } catch (error) {
      console.error('Error updating truck post:', error);
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
              <CardDescription>Düzenlemek istediğiniz araç ilanı bulunamadı.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push('/dashboard/truck-posts')}>
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
            onClick={() => router.push('/dashboard/truck-posts')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <h1 className="text-2xl font-bold">Araç İlanı Düzenle</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Araç İlanı Bilgileri</CardTitle>
            <CardDescription>Araç ilanı bilgilerini güncelleyebilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">İlan Başlığı</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Mevcut Konum</Label>
                  <Input
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Varış Noktası</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="truckType">Araç Tipi</Label>
                  <Select 
                    value={formData.truckType} 
                    onValueChange={(value) => handleSelectChange('truckType', value)}
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
                  <Label htmlFor="capacity">Kapasite (ton)</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availableDate">Müsait Tarih</Label>
                  <Input
                    id="availableDate"
                    name="availableDate"
                    type="date"
                    value={formData.availableDate}
                    onChange={handleChange}
                    required
                  />
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