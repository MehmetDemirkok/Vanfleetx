'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [postType, setPostType] = useState<'cargo' | 'truck'>('cargo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Sayısal değerleri dönüştür
    const numericFields = ['weight', 'volume', 'price', 'capacity'];
    const processedData = {
      ...data,
      loadingDate: data.loadingDate ? new Date(data.loadingDate as string).toISOString() : undefined,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate as string).toISOString() : undefined,
      availableDate: data.availableDate ? new Date(data.availableDate as string).toISOString() : undefined,
    };

    // Sayısal alanları dönüştür
    numericFields.forEach((field) => {
      if (field in processedData) {
        processedData[field] = Number(processedData[field]);
      }
    });

    try {
      const response = await fetch(`/api/${postType}-posts`, {
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

      // İlan başarıyla oluşturuldu, dashboard'a yönlendir
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Yeni İlan Oluştur</h1>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setPostType('cargo')}
            className={`px-6 py-2 rounded-lg ${
              postType === 'cargo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Yük İlanı
          </button>
          <button
            onClick={() => setPostType('truck')}
            className={`px-6 py-2 rounded-lg ${
              postType === 'truck'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Araç İlanı
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {postType === 'cargo' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yük Tipi
                </label>
                <select
                  name="cargoType"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="palet">Palet</option>
                  <option value="kasa">Kasa</option>
                  <option value="paket">Paket</option>
                  <option value="dökme">Dökme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ağırlık (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hacim (m³)
                </label>
                <input
                  type="number"
                  name="volume"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yükleme Tarihi
                </label>
                <input
                  type="date"
                  name="loadingDate"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Tarihi
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Tipi
                </label>
                <select
                  name="truckType"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="tır">Tır</option>
                  <option value="kamyon">Kamyon</option>
                  <option value="kamyonet">Kamyonet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapasite (kg)
                </label>
                <input
                  type="number"
                  name="capacity"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müsait Tarih
                </label>
                <input
                  type="date"
                  name="availableDate"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {postType === 'cargo' ? 'Yükleme Yeri' : 'Mevcut Konum'}
            </label>
            <input
              type="text"
              name={postType === 'cargo' ? 'origin' : 'currentLocation'}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Varış Yeri
            </label>
            <input
              type="text"
              name="destination"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat (₺)
            </label>
            <input
              type="number"
              name="price"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            name="description"
            rows={4}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Oluşturuluyor...' : 'İlan Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
} 