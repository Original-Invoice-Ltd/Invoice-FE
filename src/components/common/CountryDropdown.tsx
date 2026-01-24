'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
];

export default function CountryDropdown({
  value,
  onChange,
  label = 'Country or Region',
  placeholder = 'Select country',
  disabled = false,
  required = false,
}: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-[13px] ${
                  value === country.code ? 'bg-blue-50 text-[#2F80ED] font-medium' : 'text-[#344054]'
                }`}
              >
                {country.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
