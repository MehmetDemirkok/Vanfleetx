'use client';

import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search } from "lucide-react";

interface SearchFiltersProps {
  baseUrl: string;
  vehicleTypes?: Array<{ value: string; label: string }>;
  statusOptions?: Array<{ value: string; label: string }>;
  searchPlaceholder?: string;
}

export function SearchFilters({
  baseUrl,
  vehicleTypes = [
    { value: 'all', label: 'Tümü' },
    { value: 'tir', label: 'TIR' },
    { value: 'kamyon', label: 'Kamyon' },
    { value: 'pickup', label: 'Pickup' }
  ],
  statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Pasif' },
    { value: 'completed', label: 'Tamamlandı' }
  ],
  searchPlaceholder = 'Konum ara...'
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [vehicleType, setVehicleType] = useState(searchParams.get('vehicleType') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  const vehicleDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target as Node)) {
        setIsVehicleDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (vehicleType !== 'all') params.set('vehicleType', vehicleType);
    if (status !== 'all') params.set('status', status);
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm('');
    setVehicleType('all');
    setStatus('all');
    router.push(baseUrl);
  };

  const getSelectedLabel = (value: string, options: Array<{ value: string; label: string }>) => {
    return options.find(option => option.value === value)?.label || '';
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full h-9 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-[#4263eb] pl-10 bg-white"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="relative" ref={vehicleDropdownRef}>
          <button
            type="button"
            onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
            className="w-full h-9 px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4263eb] text-left flex items-center justify-between"
          >
            <span className="text-gray-700">
              {getSelectedLabel(vehicleType, vehicleTypes)}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {isVehicleDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {vehicleTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setVehicleType(type.value);
                    setIsVehicleDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 focus:outline-none text-gray-700"
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="w-full h-9 px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4263eb] text-left flex items-center justify-between"
          >
            <span className="text-gray-700">
              {getSelectedLabel(status, statusOptions)}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {isStatusDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatus(option.value);
                    setIsStatusDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 focus:outline-none text-gray-700"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 h-9 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
          >
            Sıfırla
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 h-9 px-4 text-sm font-medium text-white bg-[#4263eb] rounded-md hover:bg-[#364fc7] transition-colors focus:outline-none"
          >
            Ara
          </button>
        </div>
      </div>
    </div>
  );
} 