import { IUserConfigs } from '@bpenwell/instantlyanalyze-module';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the shape of your context data:
type AppContextType = {
  userConfig: IUserConfigs;
  setUserConfig: (status: IUserConfigs) => void;
};

// 2. Create the actual context:
const AppContext = createContext<AppContextType>({
  userConfig: {
    userId: '',
    status: 'undefined',
    freeReportsAvailable: 0,
  },
  setUserConfig: () => {},
});

// 3. Create a provider component:
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Example: store user status in state
  const [userConfig, setUserConfig] = useState<IUserConfigs>({
    userId: '',
    status: 'free',
    freeReportsAvailable: 5,
  });

  // The value provided to context consumers
  const value: AppContextType = {
    userConfig,
    setUserConfig,
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
