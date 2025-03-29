'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Platformunuza nasıl üye olabilirim?",
    answer: "Sağ üst köşedeki 'Kayıt Ol' butonuna tıklayarak üyelik formunu doldurabilirsiniz. Firma bilgilerinizi girdikten sonra hesabınız incelenerek onaylanacaktır."
  },
  {
    question: "Yük ilanı vermek ücretli mi?",
    answer: "Hayır, platformumuzda yük ilanı vermek tamamen ücretsizdir. Sadece üye olmanız ve hesabınızın onaylanması yeterlidir."
  },
  {
    question: "Nakliyeci olarak nasıl teklif verebilirim?",
    answer: "Yük ilanlarının detay sayfasında 'Teklif Ver' butonunu kullanarak teklifinizi iletebilirsiniz. Teklifiniz yük sahibine anında iletilecektir."
  },
  {
    question: "Ödeme işlemleri nasıl gerçekleşiyor?",
    answer: "Platformumuz üzerinden yapılan ödemeler güvenli ödeme altyapımız ile gerçekleştirilmektedir. Nakliye tamamlandıktan sonra ödeme nakliyeciye aktarılır."
  },
  {
    question: "Platformunuzun komisyon oranı nedir?",
    answer: "Platform üzerinden gerçekleşen başarılı taşımalardan %3 oranında komisyon alınmaktadır. Bu komisyon sadece tamamlanan taşımalar için geçerlidir."
  },
  {
    question: "Sorun yaşarsam kiminle iletişime geçebilirim?",
    answer: "7/24 müşteri destek hattımız üzerinden bizimle iletişime geçebilirsiniz. İletişim sayfamızda tüm iletişim kanallarımızı bulabilirsiniz."
  },
  {
    question: "Yük takibi yapabilir miyim?",
    answer: "Evet, platform üzerinden yükünüzün anlık konumunu ve durumunu takip edebilirsiniz. Nakliyeci, yükün durumu hakkında düzenli güncellemeler sağlar."
  },
  {
    question: "Üyelik iptali nasıl yapılır?",
    answer: "Hesap ayarlarınızdan üyelik iptali talebinde bulunabilirsiniz. İptal talebiniz 24 saat içinde işleme alınacaktır."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-lg text-gray-600">
            Platform hakkında merak ettiğiniz tüm sorular ve cevapları
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Başka sorularınız mı var?
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#4263eb] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#3451c7] transition-colors"
          >
            Bize Ulaşın
          </a>
        </div>
      </div>
    </div>
  );
} 