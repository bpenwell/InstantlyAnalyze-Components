import {
  BackendAPI,
  IUserConfigs,
  UserStatus,
} from '@bpenwell/instantlyanalyze-module';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the shape of your context data, including the new APIs:
type AppContextType = {
  isUserLoading: boolean;
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
};

// 2. Create the actual context:
const AppContext = createContext<AppContextType>({
  isUserLoading: false,
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
});

// 3. Create a provider component:
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Example: store user status in state
  const [userConfig, setUserConfig] = useState<IUserConfigs>({
    userId: '',
    status: UserStatus.UNDEFINED,
    freeReportsAvailable: 0,
    freeZillowScrapesAvailable: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const userExists = (): boolean => {
    console.log('[userExists] ', userConfig);
    return userConfig.userId !== '' || userConfig.status !== UserStatus.UNDEFINED;
  };

  const getRemainingFreeRentalReports = (): number => {
    if (!userConfig.freeReportsAvailable) {
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
    return userConfig.status === UserStatus.ADMIN ||
      userConfig.status === UserStatus.PRO ||
      (!!userConfig.freeReportsAvailable && userConfig.freeReportsAvailable > 0);
  };

  const canUseZillowScraper = (): boolean => {
    return userConfig.status === UserStatus.ADMIN ||
      userConfig.status === UserStatus.PRO ||
      (!!userConfig.freeZillowScrapesAvailable && userConfig.freeZillowScrapesAvailable > 0);
  };

  const isPaidMember = (): boolean => {
    return userConfig.status === UserStatus.ADMIN ||
      userConfig.status === UserStatus.PRO;
  };

  const recordReportUse = (): void => {
    if (!userConfig.freeReportsAvailable) {
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

  // The value provided to context consumers
  const value: AppContextType = {
    setIsUserLoading,
    isUserLoading: loading,
    userExists,
    setUserConfig,
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