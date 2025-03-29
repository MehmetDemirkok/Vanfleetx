'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewCargoPost() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Form verilerini düzenle
    const processedData = {
      ...data,
      origin: data.pickupLocation,
      destination: data.deliveryLocation,
      weight: Number(data.weight),
      volume: Number(data.volume),
      price: Number(data.price),
      loadingDate: data.loadingDate ? new Date(data.loadingDate as string).toISOString() : undefined,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate as string).toISOString() : undefined,
    };

    try {
      const response = await fetch('/api/cargo-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'İlan oluşturulurken bir hata oluştu');
      }

      router.push('/cargo-posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Yeni Yük İlanı</h1>
          <Link
            href="/cargo-posts"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Geri Dön
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    İlan Başlığı
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Örn: İstanbul - Ankara Yük Taşıma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                      Yükleme Lokasyonu
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="pickupLocation"
                        id="pickupLocation"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Örn: İstanbul, Türkiye"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700">
                      Teslimat Lokasyonu
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="deliveryLocation"
                        id="deliveryLocation"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Örn: Ankara, Türkiye"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700">
                    Yük Tipi
                  </label>
                  <div className="mt-1">
                    <select
                      id="cargoType"
                      name="cargoType"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Seçiniz</option>
                      <option value="palet">Palet</option>
                      <option value="kasa">Kasa</option>
                      <option value="paket">Paket</option>
                      <option value="dökme">Dökme</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Ağırlık (kg)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        required
                        min="0"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                      Hacim (m³)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="volume"
                        id="volume"
                        required
                        min="0"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Fiyat (₺)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="loadingDate" className="block text-sm font-medium text-gray-700">
                      Yükleme Tarihi
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="loadingDate"
                        id="loadingDate"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">
                      Teslimat Tarihi
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="deliveryDate"
                        id="deliveryDate"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Yük hakkında detaylı bilgi..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Yükleniyor...' : 'İlanı Yayınla'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 