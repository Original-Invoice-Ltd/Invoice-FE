"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { ApiClient } from '@/lib/api';
import { useAuth } from './AuthContext';
import i18n from '@/lib/i18ns';

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
  const hasFetchedLanguage = useRef(false);
  const lastFetchedUserId = useRef<string | null>(null);

  useEffect(() => {
    const fetchLanguagePreference = async () => {
      if (!user?.id || lastFetchedUserId.current === user.id) return;
      
      lastFetchedUserId.current = user.id;
      hasFetchedLanguage.current = true;
      
      try {
        const response = await ApiClient.getLanguage();
        if (response.status === 200 && response.data) {
          const responseData = response.data as { data: string };
          const apiLang = responseData.data;
          const uiLang = apiToUiLanguageMap[apiLang] ?? 'EN';
          setSelectedLanguageState(uiLang);
          // Sync with i18n
          i18n.changeLanguage(uiLang.toLowerCase());
        }
      } catch (error) {
        console.error("Unable to fetch user language preference", error);
      }
    };

    fetchLanguagePreference();
  }, [user?.id]);

  const updateLanguage = useCallback(async (language: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    setIsLoading(true);
    try {
      const apiLanguage = uiToApiLanguageMap[language];
      const response = await ApiClient.updateLanguage(apiLanguage);
      
      if (response.data?.isSuccessful || response.status === 200) {
        const normalizedLanguage = language.toUpperCase().substring(0, 2);
        setSelectedLanguageState(normalizedLanguage);
        // Sync with i18n
        i18n.changeLanguage(normalizedLanguage.toLowerCase());
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const setSelectedLanguage = useCallback((language: string) => {
    const normalizedLanguage = language.toUpperCase().substring(0, 2);
    setSelectedLanguageState(normalizedLanguage);
    // Sync with i18n
    i18n.changeLanguage(normalizedLanguage.toLowerCase());
  }, []);

  const value = useMemo(() => ({
    selectedLanguage,
    setSelectedLanguage,
    updateLanguage,
    isLoading
  }), [selectedLanguage, setSelectedLanguage, updateLanguage, isLoading]);

  return (
    <LanguageContext.Provider value={value}>
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
