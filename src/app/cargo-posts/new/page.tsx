'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TR, BG, RO } from 'country-flag-icons/react/3x2';
import { MapPinIcon, TruckIcon, ScaleIcon, CurrencyLiraIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Türkiye şehirleri
const turkiyeCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

// Bulgaristan şehirleri
const bulgarianCities = [
  'Sofya', 'Plovdiv', 'Varna', 'Burgaz', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Şumnu',
  'Pernik', 'Haskovo', 'Yambol', 'Pazarcık', 'Blagoevgrad', 'Veliko Tarnovo', 'Vratsa', 'Gabrovo', 'Asenovgrad', 'Vidin'
];

// Romanya şehirleri
const romanianCities = [
  'Bükreş', 'Cluj-Napoca', 'Timişoara', 'Iaşi', 'Constanţa', 'Craiova', 'Braşov', 'Galaţi', 'Ploieşti', 'Oradea',
  'Brăila', 'Arad', 'Piteşti', 'Sibiu', 'Bacău', 'Târgu Mureş', 'Baia Mare', 'Buzău', 'Botoşani', 'Satu Mare'
];

interface FormData {
  title: string;
  loadingCountry: string;
  loadingCity: string;
  loadingAddress: string;
  deliveryCountry: string;
  deliveryCity: string;
  unloadingAddress: string;
  cargoType: string;
  weight: string;
  volume: string;
  price: string;
  loadingDate: string;
  unloadingDate: string;
  description: string;
  palletCount?: string;
  palletType?: string;
}

export default function NewCargoPost() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    loadingCountry: 'Türkiye',
    loadingCity: '',
    loadingAddress: '',
    deliveryCountry: 'Türkiye',
    deliveryCity: '',
    unloadingAddress: '',
    cargoType: '',
    weight: '',
    volume: '',
    price: '',
    loadingDate: '',
    unloadingDate: '',
    description: '',
    palletCount: '',
    palletType: ''
  });

  const getCitiesByCountry = (country: string) => {
    switch (country) {
      case 'Türkiye':
        return turkiyeCities;
      case 'Bulgaristan':
        return bulgarianCities;
      case 'Romanya':
        return romanianCities;
      default:
        return [];
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Ülke değiştiğinde şehri sıfırla
      if (name === 'loadingCountry') {
        newData.loadingCity = '';
      } else if (name === 'deliveryCountry') {
        newData.deliveryCity = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/cargo-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/cargo-posts');
      } else {
        throw new Error('İlan oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Yeni Yük İlanı</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Geri Dön
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* İlan Başlığı */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              İlan Başlığı
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: İstanbul - Ankara Yük Taşıma"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
              required
            />
          </div>

          {/* Yükleme ve Teslimat Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Lokasyon Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yükleme Lokasyonu */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Yükleme Lokasyonu
                </label>
                <div className="space-y-3">
                  <select
                    name="loadingCountry"
                    value={formData.loadingCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  >
                    <option value="Türkiye">Türkiye</option>
                    <option value="Bulgaristan">Bulgaristan</option>
                    <option value="Romanya">Romanya</option>
                  </select>
                  <select
                    name="loadingCity"
                    value={formData.loadingCity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  >
                    <option value="">Şehir Seçin</option>
                    {getCitiesByCountry(formData.loadingCountry).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="loadingAddress"
                    value={formData.loadingAddress}
                    onChange={handleChange}
                    placeholder="Yükleme Adresi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  />
                </div>
              </div>

              {/* Teslimat Lokasyonu */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Teslimat Lokasyonu
                </label>
                <div className="space-y-3">
                  <select
                    name="deliveryCountry"
                    value={formData.deliveryCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  >
                    <option value="Türkiye">Türkiye</option>
                    <option value="Bulgaristan">Bulgaristan</option>
                    <option value="Romanya">Romanya</option>
                  </select>
                  <select
                    name="deliveryCity"
                    value={formData.deliveryCity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  >
                    <option value="">Şehir Seçin</option>
                    {getCitiesByCountry(formData.deliveryCountry).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="unloadingAddress"
                    value={formData.unloadingAddress}
                    onChange={handleChange}
                    placeholder="Teslimat Adresi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Yük Detayları */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Yük Detayları</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Yük Tipi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yük Tipi
                  </label>
                  <select
                    name="cargoType"
                    value={formData.cargoType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="palet">Palet</option>
                    <option value="koli">Koli</option>
                    <option value="konteyner">Konteyner</option>
                    <option value="dökme">Dökme Yük</option>
                    <option value="parsiyel">Parsiyel</option>
                  </select>
                </div>

                {/* Ağırlık */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ağırlık (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  />
                </div>

                {/* Hacim */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hacim (m³)
                  </label>
                  <input
                    type="number"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  />
                </div>
              </div>

              {/* Palet Detayları - Sadece Yük Tipi "palet" seçiliyse göster */}
              {formData.cargoType === 'palet' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  {/* Palet Sayısı */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palet Sayısı
                    </label>
                    <input
                      type="number"
                      name="palletCount"
                      value={formData.palletCount}
                      onChange={handleChange}
                      placeholder="Palet adedi giriniz"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                      required={formData.cargoType === 'palet'}
                    />
                  </div>
                  
                  {/* Palet Tipi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palet Tipi
                    </label>
                    <select
                      name="palletType"
                      value={formData.palletType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                      required={formData.cargoType === 'palet'}
                    >
                      <option value="">Seçiniz</option>
                      <option value="euro">Euro Palet</option>
                      <option value="industrial">Endüstriyel Palet</option>
                      <option value="plastic">Plastik Palet</option>
                      <option value="wooden">Ahşap Palet</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tarih Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Tarih Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yükleme Tarihi
                </label>
                <input
                  type="datetime-local"
                  name="loadingDate"
                  value={formData.loadingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Tarihi
                </label>
                <input
                  type="datetime-local"
                  name="unloadingDate"
                  value={formData.unloadingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fiyat Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Fiyat Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fiyat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Açıklama */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Yük hakkında detaylı bilgi verin..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#4263eb] text-white rounded-md hover:bg-[#364fc7] transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'İlanı Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 