"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiClient } from '@/lib/api';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  updateLanguage: (language: string) => Promise<boolean>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const uiToApiLanguageMap: Record<string, string> = {
  EN: 'ENGLISH',
  HA: 'HAUSA',
  IG: 'IGBO',
  YO: 'YORUBA',
  en: 'ENGLISH',
  ha: 'HAUSA',
  ig: 'IGBO',
  yo: 'YORUBA',
};

export const apiToUiLanguageMap: Record<string, string> = {
  ENGLISH: 'EN',
  HAUSA: 'HA',
  IGBO: 'IG',
  YORUBA: 'YO',
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguageState] = useState("EN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLanguagePreference = async () => {
      if (!user?.id) return;
      
      try {
        const response = await ApiClient.getLanguage();
        if (response.status === 200 && response.data) {
          const responseData = response.data as { data: string };
          const apiLang = responseData.data;
          setSelectedLanguageState(apiToUiLanguageMap[apiLang] ?? 'EN');
        }
      } catch (error) {
        console.error('Error fetching language preference:', error);
      }
    };

    fetchLanguagePreference();
  }, [user?.id]);

  const updateLanguage = async (language: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    setIsLoading(true);
    try {
      const apiLanguage = uiToApiLanguageMap[language];
      const response = await ApiClient.updateLanguage(apiLanguage);
      
      if (response.data?.isSuccessful || response.status === 200) {
        setSelectedLanguageState(language.toUpperCase().substring(0, 2));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating language:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedLanguage = (language: string) => {
    setSelectedLanguageState(language.toUpperCase().substring(0, 2));
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, updateLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
