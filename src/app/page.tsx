import Link from 'next/link';
import { TruckIcon, BuildingOfficeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function Home() {
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
              <Link
                href="/auth/signup"
                className="rounded-md bg-[#4263eb] px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-[#364fc7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4263eb] transition-all"
              >
                Hemen Başla
              </Link>
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Yük İlanları */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#4263eb] to-[#9089fc] opacity-25 blur transition group-hover:opacity-75" />
            <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 bg-[#4263eb]/10 rounded-lg mb-4">
                <TruckIcon className="w-6 h-6 text-[#4263eb]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Yük İlanları</h3>
              <p className="text-gray-600 mb-4">
                Binlerce yük ilanı arasından size uygun olanı seçin veya kendi yük ilanınızı oluşturun.
              </p>
              <Link
                href="/cargo-posts"
                className="inline-flex items-center text-[#4263eb] hover:text-[#364fc7] transition-all"
              >
                İlanları Görüntüle
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

          {/* Kamyon İlanları */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#4263eb] to-[#9089fc] opacity-25 blur transition group-hover:opacity-75" />
            <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 bg-[#4263eb]/10 rounded-lg mb-4">
                <BuildingOfficeIcon className="w-6 h-6 text-[#4263eb]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kamyon İlanları</h3>
              <p className="text-gray-600 mb-4">
                Boş kamyonunuz için yük bulun veya ihtiyacınız olan kamyon için ilan verin.
              </p>
              <Link
                href="/truck-posts"
                className="inline-flex items-center text-[#4263eb] hover:text-[#364fc7] transition-all"
              >
                İlanları Görüntüle
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

          {/* Hızlı İletişim */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#4263eb] to-[#9089fc] opacity-25 blur transition group-hover:opacity-75" />
            <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 bg-[#4263eb]/10 rounded-lg mb-4">
                <PhoneIcon className="w-6 h-6 text-[#4263eb]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hızlı İletişim</h3>
              <p className="text-gray-600 mb-4">
                7/24 müşteri hizmetlerimiz ile sorularınıza anında yanıt alın.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-[#4263eb] hover:text-[#364fc7] transition-all"
              >
                Bize Ulaşın
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
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