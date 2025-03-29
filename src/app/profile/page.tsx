'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  TruckIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('truck-posts');

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4263eb]"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const tabs = [
    {
      id: 'truck-posts',
      name: 'Araç İlanlarım',
      icon: TruckIcon,
    },
    {
      id: 'cargo-posts',
      name: 'Yük İlanlarım',
      icon: ArchiveBoxIcon,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profil Bilgileri */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-[#4263eb]/10 flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-[#4263eb]" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {session.user?.name || 'İsimsiz Kullanıcı'}
                </h2>
                <p className="text-sm text-gray-500">VanFleetX Üyesi</p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  <span className="text-sm">ABC Lojistik Ltd. Şti.</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <PhoneIcon className="h-5 w-5" />
                  <span className="text-sm">+90 (555) 123 45 67</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span className="text-sm">{session.user?.email}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/profile/edit')}
                className="w-full px-4 py-2 text-sm font-medium text-[#4263eb] bg-[#4263eb]/5 rounded-md hover:bg-[#4263eb]/10 transition-colors duration-200"
              >
                Profili Düzenle
              </button>
            </div>
          </div>
        </div>

        {/* İlanlar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-100">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-[#4263eb] text-[#4263eb]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* İlan Listesi */}
            <div className="p-6">
              {activeTab === 'truck-posts' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Araç İlanlarım</h3>
                    <button
                      onClick={() => router.push('/truck-posts/new')}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#4263eb] rounded-md hover:bg-[#364fc7] transition-colors duration-200"
                    >
                      Yeni İlan Ekle
                    </button>
                  </div>
                  
                  {/* İlan yok mesajı */}
                  <div className="text-center py-12">
                    <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz ilan yok</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Yeni bir araç ilanı oluşturarak başlayın.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Yük İlanlarım</h3>
                    <button
                      onClick={() => router.push('/cargo-posts/new')}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#4263eb] rounded-md hover:bg-[#364fc7] transition-colors duration-200"
                    >
                      Yeni İlan Ekle
                    </button>
                  </div>
                  
                  {/* İlan yok mesajı */}
                  <div className="text-center py-12">
                    <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz ilan yok</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Yeni bir yük ilanı oluşturarak başlayın.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 