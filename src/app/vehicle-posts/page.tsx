'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function VehiclePostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleType, setVehicleType] = useState('Tümü');
  const [cargoType, setCargoType] = useState('Tümü');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Araç İlanları</h1>
          <Link
            href="/vehicle-posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-[#364fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
          >
            Yeni İlan Ekle
          </Link>
        </div>

        {/* Arama ve Filtreleme */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Konum ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm rounded-md"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option>Tümü</option>
            <option>Tır</option>
            <option>Kamyon</option>
            <option>Kamyonet</option>
          </select>

          <select
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#4263eb] focus:border-[#4263eb] sm:text-sm rounded-md"
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
          >
            <option>Tümü</option>
            <option>Parsiyel</option>
            <option>Komple</option>
          </select>

          <button
            className="w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-[#364fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
          >
            Sıfırla
          </button>
        </div>

        {/* Boş Durum */}
        <div className="text-center py-12">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h3 className="mt-2 text-xl font-medium text-gray-900">Henüz İlan Bulunmuyor</h3>
          <p className="mt-1 text-sm text-gray-500">Şu anda aktif araç ilanı bulunmamaktadır.</p>
          <div className="mt-6">
            <Link
              href="/vehicle-posts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4263eb] hover:bg-[#364fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4263eb]"
            >
              İlk İlanı Oluştur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 