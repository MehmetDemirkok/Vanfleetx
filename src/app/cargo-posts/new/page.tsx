import React from 'react';
import Link from 'next/link';

export default function NewCargoPost() {
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
              <form className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    İlan Başlığı
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
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

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Yük hakkında detaylı bilgi..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    İlanı Yayınla
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