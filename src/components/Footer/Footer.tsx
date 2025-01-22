import React from 'react';
import './Footer.css';
import { Button } from '../Button/Button';
import { Link } from 'react-router-dom';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/instantlyanalyze-module';
export const Footer = () => {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Join the Adventure newsletter to receive our best vacation deals
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
            <a href={PAGE_PATH.HOME}>How it works</a>
            <a href={PAGE_PATH.HOME}>Testimonials</a>
            <a href={PAGE_PATH.HOME}>Careers</a>
            <a href={PAGE_PATH.HOME}>Investors</a>
            <a href={PAGE_PATH.HOME}>Terms of Service</a>
          </div>
          <div className='footer-link-items'>
            <h2>Contact Us</h2>
            <a href={PAGE_PATH.HOME}>Contact</a>
            <a href={PAGE_PATH.HOME}>Support</a>
            <a href={PAGE_PATH.HOME}>Destinations</a>
            <a href={PAGE_PATH.HOME}>Sponsorships</a>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Videos</h2>
            <a href={PAGE_PATH.HOME}>Submit Video</a>
            <a href={PAGE_PATH.HOME}>Ambassadors</a>
            <a href={PAGE_PATH.HOME}>Agency</a>
            <a href={PAGE_PATH.HOME}>Influencer</a>
          </div>
          <div className='footer-link-items'>
            <h2>Social Media</h2>
            <a href={PAGE_PATH.HOME}>Instagram</a>
            <a href={PAGE_PATH.HOME}>Facebook</a>
            <a href={PAGE_PATH.HOME}>Youtube</a>
            <a href={PAGE_PATH.HOME}>Twitter</a>
          </div>
        </div>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <a href={PAGE_PATH.HOME} className='social-logo'>
              TRVL
              <i className='fab fa-typo3' />
            </a>
          </div>
          <small className='website-rights'>TRVL © 2020</small>
          <div className='social-icons'>
            <a href={PAGE_PATH.HOME}
              className='social-icon-link facebook'
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f' />
            </a>
            <a href={PAGE_PATH.HOME}
              className='social-icon-link instagram'
              target='_blank'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram' />
            </a>
            <a href={PAGE_PATH.HOME}
              className='social-icon-link youtube'
              target='_blank'
              aria-label='Youtube'
            >
              <i className='fab fa-youtube' />
            </a>
            <a href={PAGE_PATH.HOME}
              className='social-icon-link twitter'
              target='_blank'
              aria-label='Twitter'
            >
              <i className='fab fa-twitter' />
            </a>
            <a href={PAGE_PATH.HOME}
              className='social-icon-link twitter'
              target='_blank'
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}