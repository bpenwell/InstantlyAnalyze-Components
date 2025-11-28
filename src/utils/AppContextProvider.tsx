import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import {
  BackendAPI,
  initialRentalCalculatorFormState,
  IUserConfigs,
  UserStatus,
  IZillowBuyboxSet,
  IDefaultRentalInputs,
  defaultRentalInputs,
  IRentalReportBuybox,
  ISubscriptionDetails,
} from '@bpenwell/instantlyanalyze-module';
import { LOCAL_STORAGE_KEYS, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
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
  canUseRentEstimator: () => boolean;
  isPaidMember: () => boolean;
  recordReportUse: () => void;
  recordZillowScraperUse: () => void;
  recordRentEstimateUse: () => void;
  getRemainingFreeRentalReports: () => number;
  getRemainingFreeZillowScrapes: () => number;
  getRemainingFreeRentEstimates: () => number;
  getTablePageSizePreference: () => number;
  setTablePageSizePreference: (number: number) => void;
  getZillowBuyBoxSetsPreference: () => IZillowBuyboxSet[] | [];
  getRentalReportBuyBoxSetsPreference: () => IRentalReportBuybox[] | [];
  setRentalReportBuyBoxSetsPreference: (value: IRentalReportBuybox[]) => void;
  setBuyBoxSetsPreference: (value: IZillowBuyboxSet[]) => void;
  getDefaultRentalInputs: () => IDefaultRentalInputs;
  setDefaultRentalInputs: (value: IDefaultRentalInputs) => void;
  getSubscriptionDetails: () => ISubscriptionDetails;
  hasSeenWelcomePage: () => boolean;
  setHasSeenWelcomePage: (hasSeen: boolean) => Promise<void>;
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
  canUseRentEstimator: () => false,
  isPaidMember: () => false,
  recordReportUse: () => {},
  getSubscriptionDetails: () => ({} as any),
  recordZillowScraperUse: () => {},
  recordRentEstimateUse: () => {},
  getRemainingFreeRentalReports: () => -1,
  getRemainingFreeZillowScrapes: () => -1,
  getRemainingFreeRentEstimates: () => -1,
  getTablePageSizePreference: () => 10,
  setTablePageSizePreference: (number: number) => {},
  getZillowBuyBoxSetsPreference: () => [],
  getRentalReportBuyBoxSetsPreference: () => [],
  setRentalReportBuyBoxSetsPreference: (value: IRentalReportBuybox[]) => {},
  setBuyBoxSetsPreference: (preferences: IZillowBuyboxSet[]) => {},
  getDefaultRentalInputs: () => defaultRentalInputs,
  setDefaultRentalInputs: (value: IDefaultRentalInputs) => {},
  hasSeenWelcomePage: () => false,
  setHasSeenWelcomePage: async (hasSeen: boolean) => {},
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
    subscription: {
      status: UserStatus.UNDEFINED,
    },
    freeReportsAvailable: 0,
    freeZillowScrapesAvailable: 0,
    freeRentEstimatesAvailable: 0,
    hasSeenWelcomePage: false,
    preferences: {
      rentalReportBuyBoxSets: [],
      tablePageSize: 10,
      zillowBuyBoxSets: [],
      defaultRentalInputs: defaultRentalInputs,
      appMode: localAppMode,
      appDensity: localAppDensity,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);

  const userExists = (): boolean => {
    return userConfig.userId !== '' || userConfig.subscription.status !== UserStatus.UNDEFINED;
  };

  const hasSeenWelcomePage = (): boolean => {
    return userConfig.hasSeenWelcomePage ?? false;
  };

  const setHasSeenWelcomePage = useCallback(async (hasSeen: boolean): Promise<void> => {
    if (!userConfig.userId) {
      console.warn('Cannot update hasSeenWelcomePage: No userId available');
      return;
    }
    
    const newUserConfig = {
      ...userConfig,
      hasSeenWelcomePage: hasSeen,
    };
    
    try {
      const backendApi: BackendAPI = new BackendAPI();
      setUserConfigState(newUserConfig);
      await backendApi.updateUserConfigs(newUserConfig, userConfig.userId);
    } catch (error) {
      console.error('Error updating hasSeenWelcomePage:', error);
      // Revert the state change if the API call failed
      setUserConfigState(userConfig);
    }
  }, [userConfig]);

  const getRemainingFreeRentalReports = (): number => {
    if (userConfig.freeReportsAvailable === undefined) {
      return 0;
    }

    return userConfig.freeReportsAvailable;
  };

  const getRemainingFreeZillowScrapes = (): number => {
    console.log('AppContextProvider - userConfig.freeZillowScrapesAvailable:', userConfig.freeZillowScrapesAvailable, 'type:', typeof userConfig.freeZillowScrapesAvailable);
    if (userConfig.freeZillowScrapesAvailable === undefined) {
      console.log('AppContextProvider - freeZillowScrapesAvailable is undefined, returning 0');
      return 0;
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
    // Wait for user config to load before attempting to record report use
    if (userConfig.subscription.status === UserStatus.UNDEFINED) {
      console.warn('[recordReportUse] User config not loaded yet, skipping report counter update');
      return;
    }

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

  const getRemainingFreeRentEstimates = (): number => {
    if (userConfig.freeRentEstimatesAvailable === undefined) {
      return 0;
    }

    return userConfig.freeRentEstimatesAvailable;
  };

  const canUseRentEstimator = (): boolean => {
    return userConfig.subscription.status === UserStatus.ADMIN ||
      userConfig.subscription.status === UserStatus.PRO ||
      (!!userConfig.freeRentEstimatesAvailable && userConfig.freeRentEstimatesAvailable > 0);
  };

  const recordRentEstimateUse = (): void => {
    // For existing users without this field, silently return (they get 0 free uses)
    if (userConfig.freeRentEstimatesAvailable === undefined) {
      console.warn('[recordRentEstimateUse] User does not have rent estimate quota');
      return;
    }

    if (userConfig.freeRentEstimatesAvailable === 0) {
      console.warn('[recordRentEstimateUse] No free rent estimates remaining');
      return;
    }

    // Only decrement if user has free uses
    if (userConfig.freeRentEstimatesAvailable > 0) {
      setUserConfig({
        ...userConfig,
        freeRentEstimatesAvailable: userConfig.freeRentEstimatesAvailable - 1,
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

  const getAppMode = (): Mode => {
    // For authenticated users, use their saved preference
    if (userConfig.userId) {
      return userConfig?.preferences?.appMode ?? localAppMode;
    }
    // For anonymous users, use the current localStorage value
    return localAppMode;
  }

  const setAppMode = (mode: Mode): void => {
    setLocalAppMode(mode);

    // Only update user config if user is authenticated
    if (userConfig.userId) {
      const newUserConfig = {
        ...userConfig,
        preferences: {
          ...userConfig.preferences,
          appMode: mode,
        }
      };
      setUserConfig(newUserConfig);
    }
  };

  const getAppDensity = (): Density => {
    // For authenticated users, use their saved preference
    if (userConfig.userId) {
      return userConfig?.preferences?.appDensity ?? localAppDensity;
    }
    // For anonymous users, use the current localStorage value
    return localAppDensity;
  };

  const setAppDensity = (density: Density): void => {
    setLocalAppDensity(density);

    // Only update user config if user is authenticated
    if (userConfig.userId) {
      const newUserConfig = {
        ...userConfig,
        preferences: {
          ...userConfig.preferences,
          appDensity: density,
        }
      };
      setUserConfig(newUserConfig);
    }
  };

  const setUserConfig = useCallback(async (newConfig: IUserConfigs): Promise<void> => {
    if (!newConfig.userId) {
      console.warn('Cannot update user config: No userId available');
      return;
    }
    
    try {
      const backendApi: BackendAPI = new BackendAPI();
      setUserConfigState(newConfig);
      await backendApi.updateUserConfigs(newConfig, newConfig.userId);
    } catch (error) {
      console.error('Error updating user config:', error);
      // Revert the state change if the API call failed
      setUserConfigState(userConfig);
    }
  }, [userConfig]);

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
    canUseRentEstimator,
    isPaidMember,
    recordReportUse,
    recordZillowScraperUse,
    recordRentEstimateUse,
    getRemainingFreeRentalReports,
    getRemainingFreeZillowScrapes,
    getRemainingFreeRentEstimates,
    getZillowBuyBoxSetsPreference,
    getRentalReportBuyBoxSetsPreference,
    setRentalReportBuyBoxSetsPreference,
    setBuyBoxSetsPreference,
    getDefaultRentalInputs,
    setDefaultRentalInputs,
    getSubscriptionDetails,
    hasSeenWelcomePage,
    setHasSeenWelcomePage,
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
