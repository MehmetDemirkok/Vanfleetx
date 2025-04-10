'use client';

import { useState } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TR, BG, RO } from 'country-flag-icons/react/3x2';
import { MapPin, Truck, Scale, Banknote, Calendar, Info } from 'lucide-react';

// Türkiye şehirleri
const turkiyeCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
  'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt',
  'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük',
  'Kilis', 'Osmaniye', 'Düzce'
];

// Bulgaristan şehirleri
const bulgarianCities = [
  'Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven',
  'Dobrich', 'Shumen', 'Pernik', 'Haskovo', 'Yambol', 'Pazardzhik', 'Blagoevgrad',
  'Veliko Tarnovo', 'Vratsa', 'Gabrovo', 'Asenovgrad', 'Vidin', 'Kazanlak', 'Kyustendil',
  'Montana', 'Targovishte', 'Lovech', 'Silistra', 'Razgrad', 'Gorna Oryahovitsa',
  'Kardzhali', 'Dupnitsa', 'Dimitrovgrad', 'Svishtov', 'Smolyan', 'Sevlievo', 'Lom',
  'Karlovo', 'Nova Zagora', 'Troyan', 'Aytos', 'Botevgrad', 'Gotse Delchev', 'Peshtera',
  'Harmanli', 'Karnobat', 'Svilengrad', 'Panagyurishte', 'Chirpan', 'Popovo', 'Rakovski'
];

// Romanya şehirleri
const romanianCities = [
  'Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov',
  'Galați', 'Ploiești', 'Oradea', 'Brăila', 'Arad', 'Pitești', 'Sibiu', 'Bacău',
  'Târgu Mureș', 'Baia Mare', 'Buzău', 'Botoșani', 'Satu Mare', 'Râmnicu Vâlcea',
  'Drobeta-Turnu Severin', 'Suceava', 'Piatra Neamț', 'Târgu Jiu', 'Târgoviște',
  'Focșani', 'Bistrița', 'Reșița', 'Tulcea', 'Călărași', 'Giurgiu', 'Hunedoara',
  'Alba Iulia', 'Deva', 'Zalău', 'Sfântu Gheorghe', 'Bârlad', 'Vaslui', 'Roman',
  'Turda', 'Mediaș', 'Slobozia', 'Alexandria', 'Voluntari', 'Miercurea Ciuc',
  'Lugoj', 'Medgidia', 'Onești', 'Petroșani'
];

// Ülkeler listesi
const countries = [
  { code: 'TR', name: 'Türkiye' },
  { code: 'DE', name: 'Almanya' },
  { code: 'FR', name: 'Fransa' },
  { code: 'IT', name: 'İtalya' },
  { code: 'GB', name: 'İngiltere' },
  { code: 'ES', name: 'İspanya' },
  { code: 'NL', name: 'Hollanda' },
  { code: 'BE', name: 'Belçika' },
  { code: 'PL', name: 'Polonya' },
  { code: 'CZ', name: 'Çek Cumhuriyeti' },
  { code: 'PT', name: 'Portekiz' },
  { code: 'SE', name: 'İsveç' },
  { code: 'AT', name: 'Avusturya' },
  { code: 'CH', name: 'İsviçre' },
  { code: 'GR', name: 'Yunanistan' },
  { code: 'HU', name: 'Macaristan' },
  { code: 'DK', name: 'Danimarka' },
  { code: 'FI', name: 'Finlandiya' },
  { code: 'SK', name: 'Slovakya' },
  { code: 'NO', name: 'Norveç' },
  { code: 'IE', name: 'İrlanda' },
  { code: 'HR', name: 'Hırvatistan' },
  { code: 'BG', name: 'Bulgaristan' },
  { code: 'RO', name: 'Romanya' },
  { code: 'RS', name: 'Sırbistan' },
  { code: 'SI', name: 'Slovenya' },
  { code: 'EE', name: 'Estonya' },
  { code: 'LV', name: 'Letonya' },
  { code: 'LT', name: 'Litvanya' },
  { code: 'LU', name: 'Lüksemburg' },
  { code: 'MT', name: 'Malta' },
  { code: 'CY', name: 'Kıbrıs' },
  { code: 'IS', name: 'İzlanda' },
  { code: 'AL', name: 'Arnavutluk' },
  { code: 'BA', name: 'Bosna Hersek' },
  { code: 'ME', name: 'Karadağ' },
  { code: 'MK', name: 'Kuzey Makedonya' },
  { code: 'MD', name: 'Moldova' },
  { code: 'UA', name: 'Ukrayna' },
  { code: 'BY', name: 'Belarus' }
];

interface FormData {
  title: string;
  loadingCountry: string;
  loadingCity: string;
  loadingAddress: string;
  unloadingCountry: string;
  unloadingCity: string;
  unloadingAddress: string;
  cargoType: string;
  weight: string;
  volume: string;
  price: string;
  loadingDate: string;
  loadingTime: string;
  description: string;
  palletCount?: string;
  palletType?: string;
}

interface SubmissionData extends Omit<FormData, 'loadingTime'> {
  loadingTime?: string;
}

export default function NewCargoPost() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    loadingCountry: 'TR',
    loadingCity: '',
    loadingAddress: '',
    unloadingCountry: 'TR',
    unloadingCity: '',
    unloadingAddress: '',
    cargoType: '',
    weight: '',
    volume: '',
    price: '',
    loadingDate: '',
    loadingTime: '',
    description: '',
    palletCount: '',
    palletType: ''
  });

  const getCitiesByCountry = (countryCode: string) => {
    switch (countryCode) {
      case 'TR':
        return turkiyeCities;
      case 'BG':
        return bulgarianCities;
      case 'RO':
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
      } else if (name === 'unloadingCountry') {
        newData.unloadingCity = '';
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
      
      // Validate required fields
      const requiredFields = [
        'title',
        'loadingCity',
        'loadingAddress',
        'unloadingCity',
        'unloadingAddress',
        'loadingDate',
        'cargoType',
        'weight',
        'volume',
        'price'
      ] as const;

      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      if (missingFields.length > 0) {
        throw new Error(`Lütfen tüm zorunlu alanları doldurun: ${missingFields.join(', ')}`);
      }

      // Format the data
      const submissionData = {
        title: formData.title.trim(),
        loadingCity: formData.loadingCity.trim(),
        loadingAddress: formData.loadingAddress.trim(),
        unloadingCity: formData.unloadingCity.trim(),
        unloadingAddress: formData.unloadingAddress.trim(),
        loadingDate: formData.loadingDate && formData.loadingTime 
          ? `${formData.loadingDate}T${formData.loadingTime}` 
          : formData.loadingDate,
        cargoType: formData.cargoType,
        weight: Number(formData.weight),
        volume: Number(formData.volume),
        price: Number(formData.price),
        description: formData.description.trim(),
        palletCount: formData.palletCount ? Number(formData.palletCount) : undefined,
        palletType: formData.palletType
      };

      console.log('Sending data:', submissionData);

      const response = await fetch('/api/cargo-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'İlan oluşturulurken bir hata oluştu');
      }

      router.push('/dashboard/cargo-posts');
    } catch (error: any) {
      console.error('Form submission error:', error);
      alert(error.message || 'İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
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

          {/* Lokasyon Bilgileri */}
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
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {formData.loadingCountry === 'TR' && (
                    <select
                      name="loadingCity"
                      value={formData.loadingCity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                      required
                    >
                      <option value="">Şehir Seçin</option>
                      {turkiyeCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    name="loadingAddress"
                    value={formData.loadingAddress}
                    onChange={handleChange}
                    placeholder={formData.loadingCountry === 'TR' ? "Yükleme Adresi" : "Şehir ve Adres Bilgisi"}
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
                    name="unloadingCountry"
                    value={formData.unloadingCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {formData.unloadingCountry === 'TR' && (
                    <select
                      name="unloadingCity"
                      value={formData.unloadingCity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                      required
                    >
                      <option value="">Şehir Seçin</option>
                      {turkiyeCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    name="unloadingAddress"
                    value={formData.unloadingAddress}
                    onChange={handleChange}
                    placeholder={formData.unloadingCountry === 'TR' ? "Teslimat Adresi" : "Şehir ve Adres Bilgisi"}
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
              {/* Yükleme Tarihi ve Saati */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yükleme Tarihi
                  </label>
                  <input
                    type="date"
                    name="loadingDate"
                    value={formData.loadingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yükleme Saati
                  </label>
                  <input
                    type="time"
                    name="loadingTime"
                    value={formData.loadingTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4263eb] focus:border-[#4263eb] text-sm"
                    required
                  />
                </div>
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