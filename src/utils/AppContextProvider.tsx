import {
  BackendAPI,
  IUserConfigs,
  UserStatus,
  IZillowBuyboxSet,
  IDefaultRentalInputs,
  defaultRentalInputs,
  IRentalReportBuybox,
  ISubscriptionDetails,
} from '@bpenwell/instantlyanalyze-module';
import { Mode } from '@cloudscape-design/global-styles';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS, useLocalStorage } from '@bpenwell/instantlyanalyze-module';

// 1. Define the shape of your context data, including the new APIs:
type AppContextType = {
  getAppMode: () => Mode;
  setAppMode: (mode: Mode) => void,
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
  getZillowBuyBoxSetsPreference: () => IZillowBuyboxSet[] | [];
  getRentalReportBuyBoxSetsPreference: () => IRentalReportBuybox[] | [];
  setRentalReportBuyBoxSetsPreference: (value: IRentalReportBuybox[]) => void;
  setBuyBoxSetsPreference: (value: IZillowBuyboxSet[]) => void;
  getDefaultRentalInputs: () => IDefaultRentalInputs;
  setDefaultRentalInputs: (value: IDefaultRentalInputs) => void;
  getSubscriptionDetails: () => ISubscriptionDetails;
};

// 2. Create the actual context:
const AppContext = createContext<AppContextType>({
  getAppMode: () => Mode.Light,
  setAppMode: (mode: Mode) => {},
  isUserLoading: false,
  setIsUserLoading: () => {},
  userExists: () => false,
  setUserConfig: () => {},
  canCreateNewReport: () => false,
  canUseZillowScraper: () => false,
  isPaidMember: () => false,
  recordReportUse: () => {},
  getSubscriptionDetails: () => ({} as any),
  recordZillowScraperUse: () => {},
  getRemainingFreeRentalReports: () => -1,
  getRemainingFreeZillowScrapes: () => -1,
  getTablePageSizePreference: () => 10,
  setTablePageSizePreference: (number: number) => {},
  getZillowBuyBoxSetsPreference: () => [],
  getRentalReportBuyBoxSetsPreference: () => [],
  setRentalReportBuyBoxSetsPreference: (value: IRentalReportBuybox[]) => {},
  setBuyBoxSetsPreference: (preferences: IZillowBuyboxSet[]) => {},
  getDefaultRentalInputs: () => defaultRentalInputs,
  setDefaultRentalInputs: (value: IDefaultRentalInputs) => {},
});

// 3. Create a provider component:
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Example: store user status in state
  const [userConfig, setUserConfig] = useState<IUserConfigs>({
    userId: '',
    subscription: {
      status: UserStatus.UNDEFINED,
    },
    freeReportsAvailable: 0,
    freeZillowScrapesAvailable: 0,
    preferences: {
      tablePageSize: 10,
      rentalReportBuyBoxSets: [],
      zillowBuyBoxSets: [],
      defaultRentalInputs: defaultRentalInputs
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
  
  const getSubscriptionDetails = (): {
    status: UserStatus;
    subscriptionId?: string;
    current_period_end?: number;
    cancel_at_period_end?: boolean;
  } => {
    return userConfig.subscription;
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

  const getZillowBuyBoxSetsPreference = (): IZillowBuyboxSet[] => {
    return userConfig?.preferences?.zillowBuyBoxSets ?? [];
  };
  
  const setBuyBoxSetsPreference = (newValue: IZillowBuyboxSet[]): void => {
    setUserConfig({
      ...userConfig,
      preferences: {
        ...userConfig.preferences,
        zillowBuyBoxSets: newValue      
      }
    });
  };

  const getRentalReportBuyBoxSetsPreference = (): IRentalReportBuybox[] => {
    return userConfig?.preferences?.rentalReportBuyBoxSets ?? [];
  }

  const setRentalReportBuyBoxSetsPreference = (newValue: IRentalReportBuybox[]): void => {
    setUserConfig({
      ...userConfig,
      preferences: {
        ...userConfig.preferences,
        rentalReportBuyBoxSets: newValue      
      }
    });
  }

  const setIsUserLoading = (value: boolean): void => {
    setLoading(value);
  }
  
  const getDefaultRentalInputs = (): IDefaultRentalInputs => {
    return userConfig?.preferences?.defaultRentalInputs ?? defaultRentalInputs;
  };
  
  const setDefaultRentalInputs = (value: IDefaultRentalInputs): void => {
    setUserConfig({
      ...userConfig,
      preferences: {
        ...userConfig.preferences,
        defaultRentalInputs: value      
      }
    });
  };

  const [appModeLocal, setAppModeLocal] = useLocalStorage<Mode>(LOCAL_STORAGE_KEYS.APP_MODE, Mode.Light);
  const [appModeState, setAppModeState] = useState<Mode>(appModeLocal);
  const getAppMode = () => {
    return appModeState;
  }

  const setAppMode = (newMode: Mode) => {
    setAppModeState(newMode);
    setAppModeLocal(newMode);
  }

  // The value provided to context consumers
  const value: AppContextType = {
    getAppMode,
    setAppMode,
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
    getZillowBuyBoxSetsPreference,
    getRentalReportBuyBoxSetsPreference,
    setRentalReportBuyBoxSetsPreference,
    setBuyBoxSetsPreference,
    getDefaultRentalInputs,
    setDefaultRentalInputs,
    getSubscriptionDetails,
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