import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../../../src/components/HeroSection/HeroSection';

// Mock the Button component
jest.mock('../../../src/components/Button/Button', () => ({
  Button: ({ label, children }: any) => (
    <button data-testid={`button-${label}`}>
      {label}
      {children}
    </button>
  ),
}));

describe('HeroSection', () => {
  const renderHeroSection = () => {
    return render(<HeroSection />);
  };

  describe('rendering', () => {
    it('should render the hero section component', () => {
      renderHeroSection();
      
      const heroContainer = screen.getByTestId('hero-container');
      expect(heroContainer).toBeInTheDocument();
    });

    it('should render the main heading', () => {
      renderHeroSection();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('ADVENTURE AWAITS');
    });

    it('should render the subtitle', () => {
      renderHeroSection();
      
      const subtitle = screen.getByText('What are you waiting for?');
      expect(subtitle).toBeInTheDocument();
    });

    it('should render the video element', () => {
      renderHeroSection();
      
      const video = screen.getByTestId('hero-container').querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('should render both buttons', () => {
      renderHeroSection();
      
      const getStartedButton = screen.getByTestId('button-GET STARTED');
      const watchTrailerButton = screen.getByTestId('button-WATCH TRAILER');
      
      expect(getStartedButton).toBeInTheDocument();
      expect(watchTrailerButton).toBeInTheDocument();
    });
  });

  describe('video element', () => {
    it('should have correct video source', () => {
      renderHeroSection();
      
      const video = screen.getByTestId('hero-container').querySelector('video');
      expect(video).toHaveAttribute('src', 'https://www.instantlyanalyze.com/public/home/homeVideo.mp4');
    });

    it('should have autoplay attribute', () => {
      renderHeroSection();
      
      const video = screen.getByTestId('hero-container').querySelector('video');
      expect(video).toHaveAttribute('autoPlay');
    });

    it('should have loop attribute', () => {
      renderHeroSection();
      
      const video = screen.getByTestId('hero-container').querySelector('video');
      expect(video).toHaveAttribute('loop');
    });

    it('should have muted attribute', () => {
      renderHeroSection();
      
      const video = screen.getByTestId('hero-container').querySelector('video') as HTMLVideoElement;
      expect(video.muted).toBe(true);
    });
  });

  describe('button content', () => {
    it('should render "GET STARTED" button with correct text', () => {
      renderHeroSection();
      
      const getStartedButton = screen.getByTestId('button-GET STARTED');
      expect(getStartedButton).toHaveTextContent('GET STARTED');
    });

    it('should render "WATCH TRAILER" button with correct text', () => {
      renderHeroSection();
      
      const watchTrailerButton = screen.getByTestId('button-WATCH TRAILER');
      expect(watchTrailerButton).toHaveTextContent('WATCH TRAILER');
    });

    it('should render play icon in watch trailer button', () => {
      renderHeroSection();
      
      const watchTrailerButton = screen.getByTestId('button-WATCH TRAILER');
      const playIcon = watchTrailerButton.querySelector('i');
      expect(playIcon).toBeInTheDocument();
      expect(playIcon).toHaveClass('far', 'fa-play-circle');
    });
  });

  describe('structure and layout', () => {
    it('should have proper container class', () => {
      renderHeroSection();
      
      const heroContainer = screen.getByTestId('hero-container');
      expect(heroContainer).toHaveClass('hero-container');
    });

    it('should have hero buttons container', () => {
      renderHeroSection();
      
      const heroContainer = screen.getByTestId('hero-container');
      const buttonsContainer = heroContainer.querySelector('.hero-btns');
      expect(buttonsContainer).toBeInTheDocument();
    });

    it('should contain all main elements', () => {
      renderHeroSection();
      
      const heroContainer = screen.getByTestId('hero-container');
      const video = heroContainer.querySelector('video');
      const heading = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText('What are you waiting for?');
      const buttonsContainer = heroContainer.querySelector('.hero-btns') as HTMLElement;
      
      expect(heroContainer).toContainElement(video);
      expect(heroContainer).toContainElement(heading);
      expect(heroContainer).toContainElement(subtitle);
      expect(heroContainer).toContainElement(buttonsContainer);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      renderHeroSection();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should have accessible video element', () => {
      renderHeroSection();
      
      const video = screen.getByTestId('hero-container').querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      renderHeroSection();
      
      const getStartedButton = screen.getByTestId('button-GET STARTED');
      const watchTrailerButton = screen.getByTestId('button-WATCH TRAILER');
      
      expect(getStartedButton).toBeInTheDocument();
      expect(watchTrailerButton).toBeInTheDocument();
    });

    it('should have proper semantic structure', () => {
      renderHeroSection();
      
      const heroContainer = screen.getByTestId('hero-container');
      expect(heroContainer.tagName).toBe('DIV');
    });
  });

  describe('content validation', () => {
    it('should display the correct main heading text', () => {
      renderHeroSection();
      
      expect(screen.getByText('ADVENTURE AWAITS')).toBeInTheDocument();
    });

    it('should display the correct subtitle text', () => {
      renderHeroSection();
      
      expect(screen.getByText('What are you waiting for?')).toBeInTheDocument();
    });

    it('should have the correct number of buttons', () => {
      renderHeroSection();
      
      const buttons = screen.getAllByTestId(/button-/);
      expect(buttons).toHaveLength(2);
    });

    it('should have the correct button labels', () => {
      renderHeroSection();
      
      expect(screen.getByText('GET STARTED')).toBeInTheDocument();
      expect(screen.getByText('WATCH TRAILER')).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should apply hero-container class', () => {
      renderHeroSection();
      
      const heroContainer = screen.getByTestId('hero-container');
      expect(heroContainer).toHaveClass('hero-container');
    });

    it('should apply hero-btns class to buttons container', () => {
      renderHeroSection();
      
      const heroContainer = screen.getByTestId('hero-container');
      const buttonsContainer = heroContainer.querySelector('.hero-btns');
      expect(buttonsContainer).toHaveClass('hero-btns');
    });
  });
}); 