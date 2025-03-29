'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MapPinIcon, TruckIcon, CalendarIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface TruckPost {
  _id: string;
  title: string;
  currentLocation: string;
  destination: string;
  truckType: string;
  capacity: number;
  price: number;
  description: string;
  availableDate: string;
  status: string;
  company: {
    name: string;
    phone: string;
  };
}

export default function TruckPostDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<TruckPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offerType, setOfferType] = useState<'cash' | 'check'>('cash');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/truck-posts/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post details');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'İlan detayları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleSubmitOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement offer submission logic here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4263eb]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Boş Araç Bilgileri */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Boş Araç Bilgileri</h1>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Aracın Bulunduğu Yer</label>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{post.currentLocation}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Gideceği Yer</label>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{post.destination}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Araç Cinsi</label>
                  <div className="flex items-center mt-1">
                    <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{post.truckType}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Araç Güzergahı</label>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">Yurtdışı Karayolu</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Aracın Yükleni Şekli</label>
                  <div className="flex items-center mt-1">
                    <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">Komple</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Dorse Cinsi</label>
                  <div className="flex items-center mt-1">
                    <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">Tenteli Dorse</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Aracın Kalkış Tarihi</label>
                  <div className="flex items-center mt-1">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{new Date(post.availableDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">İletişim</label>
                  <div className="flex items-center mt-1">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{post.company?.phone || '0532 466 59 00'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Açıklama</label>
                <p className="mt-1 text-gray-900">{post.description || 'İzmir Bulgaristan ve Romanya yükler Araç tam midilli'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Hızlı Teklif */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı Teklif</h2>
            
            <form onSubmit={handleSubmitOffer} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentType"
                        value="cash"
                        checked={offerType === 'cash'}
                        onChange={(e) => setOfferType('cash')}
                        className="h-4 w-4 text-[#4263eb] focus:ring-[#4263eb] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Nakit/Havale</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentType"
                        value="check"
                        checked={offerType === 'check'}
                        onChange={(e) => setOfferType('check')}
                        className="h-4 w-4 text-[#4263eb] focus:ring-[#4263eb] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Çek</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Tutar
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                {offerType === 'check' && (
                  <div>
                    <label htmlFor="checkDate" className="block text-sm font-medium text-gray-700">
                      Çek Vadesi
                    </label>
                    <input
                      type="date"
                      id="checkDate"
                      name="checkDate"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Teklif ile ilgili açıklama
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm"
                    placeholder="Teklifiniz hakkında detaylı bilgi verin..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4263eb] text-white py-2 px-4 rounded-md hover:bg-[#364fc7] transition-colors duration-200"
              >
                Teklifi Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 