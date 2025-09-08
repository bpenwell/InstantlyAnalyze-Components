import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeaderV2.css';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/instantlyanalyze-module';
import { Button } from '@cloudscape-design/components';
export const HeaderV2 = () => {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const redirectAPI: RedirectAPI = new RedirectAPI();

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  useEffect(() => {
    showButton();
  }, []);
  window.addEventListener('resize', showButton);
  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <a href={PAGE_PATH.HOME} className='navbar-logo' onClick={closeMobileMenu}>
            TRVL
            <i className='fab fa-typo3' />
          </a>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <a href={PAGE_PATH.HOME} className='nav-links' onClick={closeMobileMenu}>
                Home
              </a>
            </li>
            <li className='nav-item'>
              <a
                href={redirectAPI.createRedirectUrl(PAGE_PATH.RENTAL_CALCULATOR_HOME)}
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Rental Report Calculator
              </a>
            </li>
            <li className='nav-item'>
              <a
                href={redirectAPI.createRedirectUrl(PAGE_PATH.ZILLOW_SCRAPER)}
                className='nav-links'
                onClick={closeMobileMenu}
              >
                InstantlyScan
              </a>
            </li>
            <li>
              <a
                href='/sign-up'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Sign Up
              </a>
            </li>
          </ul>
          {button && <Button>SIGN UP</Button>}
        </div>
      </nav>
    </>
  );
}