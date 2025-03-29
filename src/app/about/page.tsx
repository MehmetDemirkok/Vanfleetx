import { BuildingOffice2Icon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hakkımızda
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Türkiye'nin lider lojistik platformu olarak, nakliye sektörünü dijitalleştiriyor ve daha verimli hale getiriyoruz.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
            <p className="text-gray-600">
              Lojistik sektörünü dijitalleştirerek, yük sahipleri ve nakliyeciler arasında güvenli, hızlı ve verimli bir bağlantı kurmak.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
            <p className="text-gray-600">
              Türkiye'nin ve bölgenin en büyük dijital lojistik platformu olarak, sektörün dijital dönüşümüne öncülük etmek.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#4263eb]/10 rounded-full mx-auto mb-4">
              <BuildingOffice2Icon className="w-8 h-8 text-[#4263eb]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenilir Platform</h3>
            <p className="text-gray-600">
              Doğrulanmış firmalar ve güvenli ödeme sistemi ile güvenli bir platform sunuyoruz.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#4263eb]/10 rounded-full mx-auto mb-4">
              <TruckIcon className="w-8 h-8 text-[#4263eb]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Geniş Ağ</h3>
            <p className="text-gray-600">
              Binlerce firma ve araç ile Türkiye'nin en geniş lojistik ağını oluşturuyoruz.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#4263eb]/10 rounded-full mx-auto mb-4">
              <UserGroupIcon className="w-8 h-8 text-[#4263eb]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">7/24 Destek</h3>
            <p className="text-gray-600">
              Uzman ekibimiz ile 7/24 kesintisiz destek sağlıyoruz.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#4263eb] text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Hemen Bize Katılın
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Siz de Türkiye'nin en büyük lojistik platformunun bir parçası olun.
          </p>
          <a
            href="/auth/signup"
            className="inline-block bg-white text-[#4263eb] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Ücretsiz Üye Olun
          </a>
        </div>
      </div>
    </div>
  );
} 