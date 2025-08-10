import React from 'react';
import { Button } from '../Button/Button';
import './HeroSection.css';

export const HeroSection = () => {
  return (
    <div className='hero-container' data-testid='hero-container'>
      <video src='https://www.instantlyanalyze.com/public/home/homeVideo.mp4' autoPlay loop muted={true} />
      <h1>ADVENTURE AWAITS</h1>
      <p>What are you waiting for?</p>
      <div className='hero-btns'>
        <Button label='GET STARTED'
          /*className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'*/
        />
        <Button
          label='WATCH TRAILER'
          /*className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}*/
        >
           <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}