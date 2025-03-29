'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TruckPosts() {
  const { data: session } = useSession();
  const [truckPosts, setTruckPosts] = useState([]);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kamyon İlanları</h1>
          {session && (
            <Link
              href="/truck-posts/new"
              className="bg-[#4263eb] text-white px-4 py-2 rounded-md hover:bg-[#364fc7] transition-colors"
            >
              Yeni İlan Ekle
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
              <option value="">Kamyon Tipi</option>
              <option value="tir">Tır</option>
              <option value="20-teker">20 Teker</option>
              <option value="kamyonet">Kamyonet</option>
            </select>
            <select className="border rounded-md px-3 py-2">
              <option value="">Kapasite</option>
              <option value="0-10">0-10 ton</option>
              <option value="10-20">10-20 ton</option>
              <option value="20+">20+ ton</option>
            </select>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              Filtrele
            </button>
          </div>
        </div>

        {/* İlan Listesi */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Yükleniyor...</p>
          </div>
        ) : truckPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Henüz ilan bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {truckPosts.map((post: any) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 mb-4">{post.company?.name}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {post.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Mevcut Konum</p>
                    <p className="font-medium">{post.currentLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hedef</p>
                    <p className="font-medium">{post.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kamyon Tipi</p>
                    <p className="font-medium">{post.truckType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kapasite</p>
                    <p className="font-medium">{post.capacity}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-[#4263eb]">
                    {post.price}
                  </p>
                  <Link
                    href={`/truck-posts/${post._id}`}
                    className="text-[#4263eb] hover:text-[#364fc7] transition-colors"
                  >
                    Detayları Gör →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 