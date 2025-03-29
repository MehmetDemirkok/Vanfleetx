'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function CargoPostsPage() {
  const { data: session } = useSession();
  const [cargoPosts, setCargoPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCargoPosts = async () => {
      try {
        const response = await fetch('/api/cargo-posts');
        if (!response.ok) {
          throw new Error('Failed to fetch cargo posts');
        }
        const data = await response.json();
        setCargoPosts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCargoPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yük İlanları</h1>
          {session && (
            <Link
              href="/cargo-posts/new"
              className="bg-[#4263eb] text-white px-4 py-2 rounded-md hover:bg-[#364fc7] transition-colors"
            >
              Yeni İlan Oluştur
            </Link>
          )}
        </div>

        {/* Filtreler */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Konum ara..."
              className="border rounded-md px-3 py-2"
            />
            <select className="border rounded-md px-3 py-2">
              <option value="">Yük Tipi</option>
              <option value="parsiyel">Parsiyel</option>
              <option value="komple">Komple</option>
              <option value="frigo">Frigo</option>
            </select>
            <select className="border rounded-md px-3 py-2">
              <option value="">Araç Tipi</option>
              <option value="tir">Tır</option>
              <option value="kamyon">Kamyon</option>
              <option value="kamyonet">Kamyonet</option>
            </select>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              Filtrele
            </button>
          </div>
        </div>

        {/* İlan Listesi */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4263eb] mx-auto"></div>
            <p className="mt-4 text-gray-500">Yük ilanları yükleniyor...</p>
          </div>
        ) : cargoPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Henüz ilan bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Örnek İlan */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    İstanbul - Ankara Yük Taşıma
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1" />
                      İstanbul, Türkiye
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1" />
                      Ankara, Türkiye
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-1" />
                      İlan Tarihi: 28 Mart 2024
                    </div>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 