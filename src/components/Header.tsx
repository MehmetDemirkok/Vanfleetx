'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, TruckIcon, Bars3Icon, XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsContactMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', requireAuth: true },
    { href: '/cargo-posts', label: 'Yük İlanları' },
    { href: '/truck-posts', label: 'Araç İlanları' },
  ];

  const contactItems = [
    { href: '/about', label: 'Hakkımızda' },
    { href: '/contact', label: 'İletişim' },
    { href: '/faq', label: 'Sıkça Sorulan Sorular' },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors"
              aria-label="Ana Sayfa"
            >
              <TruckIcon className="h-8 w-8" />
              <span className="text-xl font-bold">VanFleetX</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigationItems.map((item) => {
                if (item.requireAuth && !session) return null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                      isActive(item.href)
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 group",
                    isActive('/contact') || isActive('/about') || isActive('/faq')
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                  )}
                  aria-expanded={isContactMenuOpen}
                  aria-haspopup="true"
                >
                  <span>Bize Ulaşın</span>
                  <ChevronDownIcon
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      isContactMenuOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
                {isContactMenuOpen && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-popover text-popover-foreground ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {contactItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "block px-4 py-2 text-sm transition-colors duration-200",
                            isActive(item.href)
                              ? "text-primary bg-accent"
                              : "text-muted-foreground hover:bg-accent hover:text-primary"
                          )}
                          onClick={() => setIsContactMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>{session.user?.email}</span>
                </div>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
                >
                  Profilim
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
                >
                  Giriş Yap
                </Link>
                <Link href="/auth/signup">
                  <Button>Kayıt Ol</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Ana menüyü aç"
            >
              <span className="sr-only">Ana menüyü aç</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "md:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {session && (
            <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{session.user?.email}</span>
              </div>
            </div>
          )}
          {navigationItems.map((item) => {
            if (item.requireAuth && !session) return null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive(item.href)
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          {contactItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive(item.href)
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-primary"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profilim
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-primary"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 