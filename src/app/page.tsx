'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TruckIcon, BuildingOfficeIcon, PhoneIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGetStarted = () => {
    if (!session) {
      router.push('/auth/signup');
    } else {
      router.push('/dashboard');
    }
  };

  const features = [
    {
      icon: TruckIcon,
      title: 'Geniş Araç Ağı',
      description: 'Türkiye\'nin her yerinden binlerce araç ve yük ilanı arasından seçim yapın.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Güvenli Taşımacılık',
      description: 'Güvenilir taşımacılar ve müşterilerle çalışın, risksiz teslimat yapın.'
    },
    {
      icon: ClockIcon,
      title: 'Hızlı Eşleşme',
      description: 'Akıllı eşleştirme sistemi ile ihtiyacınıza uygun araç veya yükü hemen bulun.'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4263eb] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Lojistik Platformuna Hoş Geldiniz
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Türkiye'nin en kapsamlı yük ve kamyon ilan platformu ile taşımacılık artık daha kolay
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-md bg-[#4263eb] px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-[#364fc7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4263eb] transition-colors duration-200"
              >
                Hemen Başla
              </button>
              <Link
                href="/about"
                className="text-lg font-semibold leading-6 text-gray-900 hover:text-[#4263eb] transition-all"
              >
                Daha Fazla Bilgi <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#4263eb]">Daha Hızlı Teslimat</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Lojistiği Kolaylaştırıyoruz
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            VanFleetX ile lojistik süreçlerinizi dijitalleştirin, maliyetlerinizi düşürün ve 
            operasyonlarınızı optimize edin.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Icon className="h-5 w-5 flex-none text-[#4263eb]" />
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#4263eb]">10K+</div>
              <div className="mt-2 text-base text-gray-600">Aktif İlan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#4263eb]">5K+</div>
              <div className="mt-2 text-base text-gray-600">Kayıtlı Firma</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#4263eb]">50K+</div>
              <div className="mt-2 text-base text-gray-600">Başarılı Taşıma</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#4263eb]">24/7</div>
              <div className="mt-2 text-base text-gray-600">Müşteri Desteği</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 