import {
  BackendAPI,
  IUserConfigs,
  UserStatus,
  IBuyboxSet,
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
  getTablePageSizePreference: () => number;
  setTablePageSizePreference: (number: number) => void;
  getBuyBoxSetsPreference: () => IBuyboxSet[] | [];
  setBuyBoxSetsPreference: (value: IBuyboxSet[]) => void;
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
  getTablePageSizePreference: () => 10,
  setTablePageSizePreference: (number: number) => {},
  getBuyBoxSetsPreference: () => [],
  setBuyBoxSetsPreference: (preferences: IBuyboxSet[]) => {},
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
    preferences: {
      tablePageSize: 10,
      buyBoxSets: [],
    },
  });
  const [loading, setLoading] = useState<boolean>(true);

  const userExists = (): boolean => {
    console.log('[userExists] ', userConfig);
    return userConfig.userId !== '' || userConfig.status !== UserStatus.UNDEFINED;
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

  const getBuyBoxSetsPreference = (): IBuyboxSet[] => {
    return userConfig?.preferences?.buyBoxSets ?? [];
  };
  
  const setBuyBoxSetsPreference = (newValue: IBuyboxSet[]): void => {
    setUserConfig({
      ...userConfig,
      preferences: {
        ...userConfig.preferences,
        buyBoxSets: newValue      
      }
    });
  };

  const setIsUserLoading = (value: boolean): void => {
    setLoading(value);
  }

  // The value provided to context consumers
  const value: AppContextType = {
    setIsUserLoading,
    getTablePageSizePreference,
    setTablePageSizePreference,
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
    getBuyBoxSetsPreference,
    setBuyBoxSetsPreference
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