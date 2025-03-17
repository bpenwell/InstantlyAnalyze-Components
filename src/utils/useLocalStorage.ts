// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useCallback, useEffect, useState } from 'react';

export enum LOCAL_STORAGE_KEYS {
  APP_MODE = 'APP_MODE',
  APP_DENSITY = 'APP_DENSITY',
  USER_CONFIGS = 'USER_CONFIGS',
  RENTALCALCULATOR_WIDTHS = 'RENTALCALCULATOR_WIDTHS',
}

type ConsentCookie = {
  advertising: boolean;
  essential: boolean;
  functional: boolean;
  performance: boolean;
};

export interface CookieConsent {
  checkForCookieConsent: () => void;
  getConsentCookie: () => ConsentCookie;
}

declare global {
  interface Window {
    AwsUiConsent: CookieConsent;
  }
}

export const save = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const remove = (key: string) => localStorage.removeItem(key);

export const load = (key: string) => {
  const value = localStorage.getItem(key);
  try {
    return value && JSON.parse(value);
  } catch (e) {
    console.warn(
      `⚠️ The ${key} value that is stored in localStorage is incorrect. Try to remove the value ${key} from localStorage and reload the page`
    );
    return undefined;
  }
};

export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const savedValue = load(key);
  const [value, setValue] = useState<T>(() => savedValue ?? defaultValue);

  // Listen for external changes to localStorage.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(event.newValue ? JSON.parse(event.newValue) : defaultValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, defaultValue]);

  const handleValueChange = useCallback(
    (newValue: T) => {
      setValue(newValue);
      save(key, newValue);
    },
    [key]
  );

  const handleValueReset = useCallback(
    (newValue: T) => {
      setValue(newValue);
      remove(key);
    },
    [key]
  );

  return [value, handleValueChange, handleValueReset] as const;
}
