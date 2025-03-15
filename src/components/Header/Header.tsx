import React from 'react';
import '../../index.css';
import Navbar from './Navbar';
import { LOCAL_STORAGE_KEYS, PAGE_PATH, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
import { Mode } from '@cloudscape-design/global-styles';

export const Header: React.FC = () => {
  const [appMode, setAppMode] = useLocalStorage<Mode>(
      LOCAL_STORAGE_KEYS.APP_MODE,
      Mode.Light
    );
    const path = window.location.pathname;
    const bgImg=appMode===Mode.Light?'grid_bg.png':'grid_bg_dark.png';
    const bg=path==PAGE_PATH.HOME?{background:`url("/public/${bgImg}")`,backgroundSize:'cover',backgroundPositionY:'8%'}:{};
 
 
    return(
    <div className={appMode}>
      <header className={`flex justify-center dark:bg-[#161D26] py-z4`} style={bg}>
        <Navbar />
      </header>
    </div>
  );
};
