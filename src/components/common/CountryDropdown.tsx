'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import countries from 'world-countries';

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

// Transform world-countries data to our format
const COUNTRIES = countries.map(country => ({
  code: country.cca2,
  name: country.name.common
})).sort((a, b) => a.name.localeCompare(b.name));

export default function CountryDropdown({
  value,
  onChange,
  label = 'Country or Region',
  placeholder = 'Select country',
  disabled = false,
  required = false,
}: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    return COUNTRIES.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="block text-[13px] font-medium text-[#344054]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500 text-[13px]"
        >
          <span className={selectedCountry ? 'text-[#344054]' : 'text-[#98A2B3]'}>
            {selectedCountry ? selectedCountry.name : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-[#667085] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
            {/* Search Bar */}
            <div className="p-2 border-b border-[#D0D5DD]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Countries List */}
            <div className="overflow-y-auto max-h-48">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors text-[13px] ${
                      value === country.code ? 'bg-blue-50 text-[#2F80ED] font-medium' : 'text-[#344054]'
                    }`}
                  >
                    {country.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-[13px] text-[#667085]">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
