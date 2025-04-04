import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import { UserActivityTracker } from '@/components/user-activity-tracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'VanFleetX | Lojistik Platform',
    template: '%s | VanFleetX'
  },
  description: 'Yük ve kamyon ilanları için lojistik platformu',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      }
    ],
    apple: {
      url: '/apple-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
  },
  manifest: '/site.webmanifest',
  applicationName: 'VanFleetX',
  keywords: ['lojistik', 'nakliye', 'taşımacılık', 'yük', 'kamyon', 'tır'],
  authors: [{ name: 'VanFleetX Team' }],
  creator: 'VanFleetX',
  publisher: 'VanFleetX',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#4263eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.className}>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster position="top-right" richColors />
          <UserActivityTracker />
          <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Lojistik Platform. Tüm hakları saklıdır.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
} 