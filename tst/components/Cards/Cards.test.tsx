import React from 'react';
import { render, screen } from '@testing-library/react';
import { Cards } from '../../../src/components/Cards/Cards';

// Mock the CardItem component
jest.mock('../../../src/components/Cards/CardItem', () => ({
  CardItem: ({ src, text, label, path }: any) => (
    <li data-testid="card-item" data-src={src} data-text={text} data-label={label} data-path={path}>
      {text}
    </li>
  ),
}));

describe('Cards', () => {
  const renderCards = () => {
    return render(<Cards />);
  };

  describe('rendering', () => {
    it('should render the main heading', () => {
      renderCards();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Check out these EPIC Destinations!');
    });

    it('should render the cards container structure', () => {
      renderCards();
      
      const cardsContainer = screen.getByTestId('cards-container');
      const cardsWrapper = screen.getByTestId('cards-wrapper');
      
      expect(cardsContainer).toBeInTheDocument();
      expect(cardsWrapper).toBeInTheDocument();
    });

    it('should render all card items', () => {
      renderCards();
      
      const cardItems = screen.getAllByTestId('card-item');
      expect(cardItems).toHaveLength(5);
    });
  });

  describe('card content', () => {
    it('should render the first card with correct content', () => {
      renderCards();
      
      const cardItems = screen.getAllByTestId('card-item');
      const firstCard = cardItems[0];
      
      expect(firstCard).toHaveAttribute('data-src', 'public/home/img-9.jpg');
      expect(firstCard).toHaveAttribute('data-text', 'Explore the hidden waterfall deep inside the Amazon Jungle');
      expect(firstCard).toHaveAttribute('data-label', 'Adventure');
      expect(firstCard).toHaveAttribute('data-path', '/services');
    });

    it('should render the second card with correct content', () => {
      renderCards();
      
      const cardItems = screen.getAllByTestId('card-item');
      const secondCard = cardItems[1];
      
      expect(secondCard).toHaveAttribute('data-src', 'public/home/img-2.jpg');
      expect(secondCard).toHaveAttribute('data-text', 'Travel through the Islands of Bali in a Private Cruise');
      expect(secondCard).toHaveAttribute('data-label', 'Luxury');
      expect(secondCard).toHaveAttribute('data-path', '/services');
    });

    it('should render the third card with correct content', () => {
      renderCards();
      
      const cardItems = screen.getAllByTestId('card-item');
      const thirdCard = cardItems[2];
      
      expect(thirdCard).toHaveAttribute('data-src', 'public/home/img-3.jpg');
      expect(thirdCard).toHaveAttribute('data-text', 'Set Sail in the Atlantic Ocean visiting Uncharted Waters');
      expect(thirdCard).toHaveAttribute('data-label', 'Mystery');
      expect(thirdCard).toHaveAttribute('data-path', '/services');
    });

    it('should render the fourth card with correct content', () => {
      renderCards();
      
      const cardItems = screen.getAllByTestId('card-item');
      const fourthCard = cardItems[3];
      
      expect(fourthCard).toHaveAttribute('data-src', 'public/home/img-4.jpg');
      expect(fourthCard).toHaveAttribute('data-text', 'Experience Football on Top of the Himilayan Mountains');
      expect(fourthCard).toHaveAttribute('data-label', 'Adventure');
      expect(fourthCard).toHaveAttribute('data-path', '/products');
    });

    it('should render the fifth card with correct content', () => {
      renderCards();
      
      const cardItems = screen.getAllByTestId('card-item');
      const fifthCard = cardItems[4];
      
      expect(fifthCard).toHaveAttribute('data-src', 'public/home/img-8.jpg');
      expect(fifthCard).toHaveAttribute('data-text', 'Ride through the Sahara Desert on a guided camel tour');
      expect(fifthCard).toHaveAttribute('data-label', 'Adrenaline');
      expect(fifthCard).toHaveAttribute('data-path', '/sign-up');
    });
  });

  describe('structure', () => {
    it('should have proper HTML structure', () => {
      renderCards();
      
      const cardsDiv = screen.getByTestId('cards');
      const heading = screen.getByRole('heading', { level: 1 });
      const container = screen.getByTestId('cards-container');
      const wrapper = screen.getByTestId('cards-wrapper');
      
      expect(cardsDiv).toContainElement(heading);
      expect(cardsDiv).toContainElement(container);
      expect(container).toContainElement(wrapper);
    });

    it('should have two card item lists', () => {
      renderCards();
      
      const cardItemLists = screen.getAllByTestId('cards-items');
      expect(cardItemLists).toHaveLength(2);
    });

    it('should have correct number of cards in each list', () => {
      renderCards();
      
      const cardItemLists = screen.getAllByTestId('cards-items');
      const firstList = cardItemLists[0];
      const secondList = cardItemLists[1];
      
      const firstListCards = firstList.querySelectorAll('[data-testid="card-item"]');
      const secondListCards = secondList.querySelectorAll('[data-testid="card-item"]');
      
      expect(firstListCards).toHaveLength(2);
      expect(secondListCards).toHaveLength(3);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      renderCards();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should have proper list structure', () => {
      renderCards();
      
      const lists = screen.getAllByTestId('cards-items');
      lists.forEach(list => {
        expect(list.tagName).toBe('UL');
      });
    });

    it('should have proper list item structure', () => {
      renderCards();
      
      const cardItems = screen.getAllByTestId('card-item');
      cardItems.forEach(item => {
        expect(item.tagName).toBe('LI');
      });
    });
  });
}); 