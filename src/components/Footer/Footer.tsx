import React from 'react';
import './Footer.css';
import { useAppContext } from '../../utils/AppContextProvider';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/instantlyanalyze-module';
import { Mode } from '@cloudscape-design/global-styles';

export const Footer = () => {
  const redirectApi: RedirectAPI = new RedirectAPI();
  const { getAppMode } = useAppContext();
  const appMode = getAppMode();
  const logo=appMode===Mode.Light?'logo_light.png':'logo_dark.png';

  return (
    <div className={appMode}>
      <footer 
        className="text-gray-700 dark:text-gray-300"
        style={{
          backgroundColor: appMode === Mode.Dark 
            ? 'var(--color-background-layout-main-5ilwcb, #ffffff)' 
            : '#f8fafc'
        }}
      >
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src={`/public/${logo}`} 
                  alt="InstantlyAnalyze" 
                  className="h-12 w-auto" 
                />
              </div>
              <p className="text-lg leading-relaxed mb-6 max-w-md">
                Automate your real estate deal analysis with powerful tools designed for investors. 
                Make smarter investment decisions faster.
              </p>
              <div className="flex space-x-4">
                <a 
                  href={redirectApi.createRedirectUrl(PAGE_PATH.FACEBOOK)} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <span className="text-sm font-bold">f</span>
                </a>
                <a 
                  href={redirectApi.createRedirectUrl(PAGE_PATH.INSTAGRAM)} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <span className="text-sm font-bold">ig</span>
                </a>
                <a 
                  href={redirectApi.createRedirectUrl(PAGE_PATH.TWITTER)} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="X (Twitter)"
                >
                  <span className="text-sm font-bold">X</span>
                </a>
                <a 
                  href={redirectApi.createRedirectUrl(PAGE_PATH.YOUTUBE)} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="YouTube"
                >
                  <span className="text-sm font-bold">▶</span>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    href={redirectApi.createRedirectUrl(PAGE_PATH.CONTACT_US)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a 
                    href={redirectApi.createRedirectUrl(PAGE_PATH.MISSION)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    Our Mission
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Legal & Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href={redirectApi.createRedirectUrl(PAGE_PATH.PRIVACY_POLICY_AND_TERMS)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    Privacy Policy & Terms
                  </a>
                </li>
                <li>
                  <a 
                    href={redirectApi.createRedirectUrl(PAGE_PATH.BLOG)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t border-gray-200 dark:border-gray-700"
          style={{
            backgroundColor: appMode === Mode.Dark 
              ? 'rgba(0, 0, 0, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                &copy; 2025 <span className="font-semibold">InstantlyAnalyze™</span>. All Rights Reserved.
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Made with ❤️ for real estate investors
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};