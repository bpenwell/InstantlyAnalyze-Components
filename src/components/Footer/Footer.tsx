import React from 'react';
import './Footer.css';
import { Button } from '../Button/Button';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/instantlyanalyze-module';

export const Footer = () => {
  const redirectApi = new RedirectAPI();

  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Join the InstantlyAnalyze newsletter to receive our best investment deals
        </p>
        <p className='footer-subscription-text'>
          You can unsubscribe at any time.
        </p>
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
            <Button label='Subscribe'/>
          </form>
        </div>
      </section>
      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>About Us</h2>
            <a href={PAGE_PATH.MISSION}>Mission & Vision</a>
            <a href={PAGE_PATH.PRIVACY_POLICY_AND_TERMS}>Terms of Service</a>
          </div>
          <div className='footer-link-items'>
            <h2>Contact Us</h2>
            <a href={PAGE_PATH.CONTACT_US}>Contact Us</a>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Social Media</h2>
            <a href={PAGE_PATH.INSTAGRAM}>Instagram</a>
            <a href={PAGE_PATH.FACEBOOK}>Facebook</a>
            <a href={PAGE_PATH.YOUTUBE}>YouTube</a>
            <a href={PAGE_PATH.TWITTER}>Twitter</a>
            <a href={PAGE_PATH.LINKEDIN}>LinkedIn</a>
          </div>
        </div>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <a href={PAGE_PATH.HOME} className='social-logo'>
              InstantlyAnalyze
              <i className='fab fa-typo3' />
            </a>
          </div>
          <small className='website-rights'>InstantlyAnalyze © 2025</small>
          <div className='social-icons'>
            <a href={PAGE_PATH.INSTAGRAM} className='social-icon-link instagram' aria-label='Instagram'>
              <i className='fab fa-instagram' />
            </a>
            <a href={PAGE_PATH.FACEBOOK} className='social-icon-link facebook' aria-label='Facebook'>
              <i className='fab fa-facebook-f' />
            </a>
            <a href={PAGE_PATH.YOUTUBE} className='social-icon-link youtube' aria-label='YouTube'>
              <i className='fab fa-youtube' />
            </a>
            <a href={PAGE_PATH.TWITTER} className='social-icon-link twitter' aria-label='Twitter'>
              <i className='fab fa-twitter' />
            </a>
            <a href={PAGE_PATH.LINKEDIN} className='social-icon-link linkedin' aria-label='LinkedIn'>
              <i className='fab fa-linkedin' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};