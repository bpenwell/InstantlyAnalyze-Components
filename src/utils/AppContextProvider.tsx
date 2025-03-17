import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import {
  BackendAPI,
  initialRentalCalculatorFormState,
  IUserConfigs,
  UserStatus,
} from '@bpenwell/instantlyanalyze-module';
import { LOCAL_STORAGE_KEYS, useLocalStorage } from './useLocalStorage';
import { Mode, Density } from '@cloudscape-design/global-styles';

// 1. Define the shape of your context data, including the new APIs:
type AppContextType = {
  isUserLoading: boolean;
  getAppMode: () => Mode;
  setAppMode: (mode: Mode) => void;
  getAppDensity: () => Density;
  setAppDensity: (mode: Density) => void;
  setIsUserLoading: (value: boolean) => void;
  userExists: () => boolean;
  setUserConfig: (status: IUserConfigs) => void;
  canCreateNewReport: () => boolean;
  canUseZillowScraper: () => boolean;
  isPaidMember: () => boolean;
  recordReportUse: () => void;
  recordZillowScraperUse: () => void;
  getRemainingFreeRentalReports: () => number;
  getRemainingFreeZillowScrapes: () => number;
  getTablePageSizePreference: () => number;
  setTablePageSizePreference: (number: number) => void;
};

// 2. Create the actual context:
const AppContext = createContext<AppContextType>({
  isUserLoading: false,
  getAppMode: () => Mode.Light,
  setAppMode: (mode: Mode) => {},
  getAppDensity: () => Density.Comfortable,
  setAppDensity: (density: Density) => {},
  setIsUserLoading: () => {},
  userExists: () => false,
  setUserConfig: () => {},
  canCreateNewReport: () => false,
  canUseZillowScraper: () => false,
  isPaidMember: () => false,
  recordReportUse: () => {},
  recordZillowScraperUse: () => {},
  getRemainingFreeRentalReports: () => -1,
  getRemainingFreeZillowScrapes: () => -1,
  getTablePageSizePreference: () => 10,
  setTablePageSizePreference: (number: number) => {},
});

// 3. Create a provider component:
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [localAppMode, setLocalAppMode] = useLocalStorage<Mode>(LOCAL_STORAGE_KEYS.APP_MODE, Mode.Light);
  const [localAppDensity, setLocalAppDensity] = useLocalStorage<Density>(LOCAL_STORAGE_KEYS.APP_DENSITY, Density.Comfortable);
  // Example: store user status in state
  const [userConfig, setUserConfigState] = useState<IUserConfigs>({
    userId: '',
    freeReportsAvailable: 0,
    freeZillowScrapesAvailable: 0,
    subscription: {
      status: UserStatus.UNDEFINED,
    },
    preferences: {
      defaultRentalInputs: {
        ...initialRentalCalculatorFormState,
      },
      rentalReportBuyBoxSets: [],
      tablePageSize: 10,
      appMode: localAppMode,
      appDensity: localAppDensity,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);

  const userExists = (): boolean => {
    console.log('[userExists] ', userConfig);
    return userConfig.userId !== '' || userConfig.subscription.status !== UserStatus.UNDEFINED;
  };

  const getRemainingFreeRentalReports = (): number => {
    if (userConfig.freeReportsAvailable === undefined) {
      return 0;
    }

    return userConfig.freeReportsAvailable;
  };

  const getRemainingFreeZillowScrapes = (): number => {
    if (!userConfig.freeZillowScrapesAvailable) {
      throw new Error('[getRemainingFreeZillowScrapes] userConfig.freeZillowScrapesAvailable does not exist');
    }

    return userConfig.freeZillowScrapesAvailable;
  };

  const canCreateNewReport = (): boolean => {
    return userConfig.subscription.status === UserStatus.ADMIN ||
      userConfig.subscription.status === UserStatus.PRO ||
      (!!userConfig.freeReportsAvailable && userConfig.freeReportsAvailable > 0);
  };

  const canUseZillowScraper = (): boolean => {
    return userConfig.subscription.status === UserStatus.ADMIN ||
      userConfig.subscription.status === UserStatus.PRO ||
      (!!userConfig.freeZillowScrapesAvailable && userConfig.freeZillowScrapesAvailable > 0);
  };

  const isPaidMember = (): boolean => {
    return userConfig.subscription.status === UserStatus.ADMIN ||
      userConfig.subscription.status === UserStatus.PRO;
  };

  const recordReportUse = (): void => {
    if (isPaidMember()) return;

    if (userConfig.freeReportsAvailable === undefined) {
      throw new Error('[recordReportUse] userConfig.freeReportsAvailable does not exist');
    }
    else if (userConfig.freeReportsAvailable === 0) {
      throw new Error('[recordReportUse] userConfig.freeReportsAvailable is already 0');
    }

    if (userConfig.freeReportsAvailable && userConfig.freeReportsAvailable > 0) {
      setUserConfig({
        ...userConfig,
        freeReportsAvailable: userConfig.freeReportsAvailable - 1,
      });
    }
  };

  const getTablePageSizePreference = (): number => {
    return userConfig.preferences?.tablePageSize || 10;
  }

  const setTablePageSizePreference = async (size: number): Promise<void> => {
      const backendApi: BackendAPI = new BackendAPI();
      const newUserConfig = {
        ...userConfig,
        preferences: {
          ...userConfig.preferences,
          tablePageSize: size,
        }
      };
      const updatedUserConfig = await backendApi.updateUserConfigs(newUserConfig, userConfig.userId);
      setUserConfig(updatedUserConfig);
  }

  const recordZillowScraperUse = (): void => {
    if (!userConfig.freeZillowScrapesAvailable) {
      throw new Error('[recordZillowScraperUse] userConfig.freeZillowScrapesAvailable does not exist');
    }
    else if (userConfig.freeZillowScrapesAvailable === 0) {
      throw new Error('[recordZillowScraperUse] userConfig.freeZillowScrapesAvailable does not exist');
    }

    if (userConfig.freeZillowScrapesAvailable && userConfig.freeZillowScrapesAvailable > 0) {
      setUserConfig({
        ...userConfig,
        freeZillowScrapesAvailable: userConfig.freeZillowScrapesAvailable - 1,
      });
    }
  };

  const setIsUserLoading = (value: boolean): void => {
    setLoading(value);
  }

  const getAppMode = (): Mode => {
    console.log('[getAppMode] ', userConfig.preferences.appMode, localAppMode);
    return userConfig?.preferences?.appMode ?? localAppMode;
  }

  const setAppMode = (mode: Mode): void => {
    const newUserConfig = {
      ...userConfig,
      preferences: {
        ...userConfig.preferences,
        appMode: mode,
      }
    };
    setUserConfig(newUserConfig);
    setLocalAppMode(mode);
  };

  const getAppDensity = (): Density => {
    return userConfig?.preferences?.appDensity ?? localAppDensity;
  };

  const setAppDensity = (density: Density): void => {
    const newUserConfig = {
      ...userConfig,
      preferences: {
        ...userConfig.preferences,
        appDensity: density,
      }
    };
    setLocalAppDensity(density);
    setUserConfig(newUserConfig);
  };

  const setUserConfig = async (newConfig: IUserConfigs): Promise<void> => {
    const backendApi: BackendAPI = new BackendAPI();
    setUserConfigState(newConfig);
    const updatedUserConfig = await backendApi.updateUserConfigs(newConfig, newConfig.userId);
  };

  // The value provided to context consumers
  const value: AppContextType = {
    getAppMode,
    setAppMode,
    getAppDensity,
    setAppDensity,
    setIsUserLoading,
    getTablePageSizePreference,
    setTablePageSizePreference,
    isUserLoading: loading,
    userExists,
    setUserConfig: setUserConfigState,
    canCreateNewReport,
    canUseZillowScraper,
    isPaidMember,
    recordReportUse,
    recordZillowScraperUse,
    getRemainingFreeRentalReports,
    getRemainingFreeZillowScrapes,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

// 4. Optional: Create a custom hook to make consuming context simpler:
export const useAppContext = (): AppContextType => {
  const context = useContext<AppContextType>(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};