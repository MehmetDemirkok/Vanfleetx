'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsContactMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sayfa değiştiğinde dropdown'ı kapat
  useEffect(() => {
    setIsContactMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-[#4263eb]">
              <TruckIcon className="h-8 w-8" />
              <span className="text-xl font-bold">VanFleetX</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {session && (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    isActive('/dashboard')
                      ? 'text-gray-900 border-b-2 border-[#4263eb]'
                      : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/cargo-posts"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                  isActive('/cargo-posts')
                    ? 'text-gray-900 border-b-2 border-[#4263eb]'
                    : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                }`}
              >
                Yük İlanları
              </Link>
              <Link
                href="/truck-posts"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                  isActive('/truck-posts')
                    ? 'text-gray-900 border-b-2 border-[#4263eb]'
                    : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                }`}
              >
                Araç İlanları
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 group ${
                    isActive('/contact') || isActive('/about') || isActive('/faq')
                      ? 'text-gray-900 border-b-2 border-[#4263eb]'
                      : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                  }`}
                >
                  <span>Bize Ulaşın</span>
                  <ChevronDownIcon
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      isContactMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isContactMenuOpen && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        href="/about"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isActive('/about')
                            ? 'text-[#4263eb] bg-gray-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#4263eb]'
                        }`}
                        onClick={() => setIsContactMenuOpen(false)}
                      >
                        Hakkımızda
                      </Link>
                      <Link
                        href="/contact"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isActive('/contact')
                            ? 'text-[#4263eb] bg-gray-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#4263eb]'
                        }`}
                        onClick={() => setIsContactMenuOpen(false)}
                      >
                        İletişim
                      </Link>
                      <Link
                        href="/faq"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isActive('/faq')
                            ? 'text-[#4263eb] bg-gray-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#4263eb]'
                        }`}
                        onClick={() => setIsContactMenuOpen(false)}
                      >
                        Sıkça Sorulan Sorular
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  Profilim
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#4263eb] text-white px-4 py-2 rounded-md hover:bg-[#364fc7] transition-colors duration-200 text-sm font-medium"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 