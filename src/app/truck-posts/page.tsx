'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MapPinIcon, TruckIcon, ScaleIcon, TagIcon } from '@heroicons/react/24/outline';
import { TR, BG, RO } from 'country-flag-icons/react/3x2';

interface TruckPost {
  _id: string;
  title: string;
  currentLocation: string;
  destination: string;
  truckType: string;
  capacity: number;
  status: string;
}

export default function TruckPosts() {
  const { data: session } = useSession();
  const [truckPosts, setTruckPosts] = useState<TruckPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTruckPosts = async () => {
      try {
        const response = await fetch('/api/truck-posts');
        if (!response.ok) {
          throw new Error('Failed to fetch truck posts');
        }
        const data = await response.json();
        setTruckPosts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTruckPosts();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryFlag = (location: string) => {
    const lowerLocation = location.toLowerCase();
    if (lowerLocation.includes('türkiye') || lowerLocation.includes('turkey')) {
      return <TR className="w-4 h-4" title="Türkiye" />;
    } else if (lowerLocation.includes('bulgaristan') || lowerLocation.includes('bulgaria')) {
      return <BG className="w-4 h-4" title="Bulgaristan" />;
    } else if (lowerLocation.includes('romanya') || lowerLocation.includes('romania')) {
      return <RO className="w-4 h-4" title="Romanya" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Kamyon İlanları</h1>
          {session && (
            <Link
              href="/truck-posts/new"
              className="bg-[#4263eb] text-white px-3 py-1.5 rounded-md hover:bg-[#364fc7] transition-colors text-sm font-medium"
            >
              + Yeni İlan
            </Link>
          )}
        </div>

        {/* Filtreler */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Konum ara..."
              className="border rounded-md px-3 py-1.5 text-sm focus:ring-[#4263eb] focus:border-[#4263eb]"
            />
            <select className="border rounded-md px-3 py-1.5 text-sm focus:ring-[#4263eb] focus:border-[#4263eb]">
              <option value="">Araç Tipi</option>
              <option value="tir">Tır</option>
              <option value="kamyon">Kamyon</option>
              <option value="kamyonet">Kamyonet</option>
            </select>
            <select className="border rounded-md px-3 py-1.5 text-sm focus:ring-[#4263eb] focus:border-[#4263eb]">
              <option value="">Kapasite</option>
              <option value="0-10">0-10 ton</option>
              <option value="10-20">10-20 ton</option>
              <option value="20+">20+ ton</option>
            </select>
            <button className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
              Filtrele
            </button>
          </div>
        </div>

        {/* İlan Listesi */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4263eb] mx-auto"></div>
          </div>
        ) : truckPosts.length === 0 ? (
          <div className="text-center py-8">
            <TruckIcon className="h-10 w-10 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Henüz ilan bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mevcut Konum
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hedef
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Araç Tipi
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kapasite
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {truckPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          {getCountryFlag(post.currentLocation)}
                          <span className="ml-1.5 text-sm text-gray-900">{post.currentLocation}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          {getCountryFlag(post.destination)}
                          <span className="ml-1.5 text-sm text-gray-900">{post.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <TruckIcon className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          <span className="text-sm text-gray-900">{post.truckType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <ScaleIcon className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          <span className="text-sm text-gray-900">{post.capacity} ton</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/truck-posts/${post._id}`}
                          className="text-[#4263eb] hover:text-[#364fc7] font-medium text-sm"
                        >
                          Detayları Gör
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 