import PlayingCard from './PlayingCard.jsx';
import type { Card, Suit } from '../utilities/Blackjack.js';
import { useEffect, useState } from '@lynx-js/react';

import './DealerHand.css';

export default function DealerHand(props: {
    cards: Array<Card>;
    animate?: boolean;
    revealAll?: boolean;
}) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastCardIndex, setLastCardIndex] = useState(-1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [cardState, setCardState] = useState<'flipped' | 'actual'>('flipped');
  const [flipAnimationPlayed, setFlipAnimationPlayed] = useState(false);
  
  // Track the newest card for animation
  useEffect(() => {
    if (props.cards.length > 0) {
      // If this is the first render or cards just changed
      if (lastCardIndex === -1 || props.cards.length > lastCardIndex + 1) {
        setLastCardIndex(props.cards.length - 1);
      }
    } else {
      setLastCardIndex(-1);
    }
  }, [props.cards]);
  
  // Trigger animation when cards change or when explicitly requested
  useEffect(() => {
    if (props.cards.length) {
      // Force animation to be disabled first
      setShowAnimation(false);
      
      // Clear any existing animation timers
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 50); // Slightly longer delay for more reliable reset
      
      // Clean up timer on unmount or before next effect run
      return () => clearTimeout(timer);
    }
  }, [props.cards]);

  // Handle the card reveal state
  useEffect(() => {
    // Set initial card state when cards are dealt
    if (props.cards.length > 1) {
      if (props.revealAll) {
        // If cards should be revealed from the start, show the actual card
        setCardState('actual');
      } else {
        // Otherwise show flipped
        setCardState('flipped');
      }
    }
  }, [props.cards.length]);

  // Handle the card flip animation
  useEffect(() => {
    // Only trigger flip animation when revealAll becomes true and we haven't played it yet
    if (props.revealAll && !flipAnimationPlayed && cardState === 'flipped' && props.cards.length > 1) {
      console.log('Starting flip animation');
      
      // Start flip animation but keep showing the flipped card
      setIsFlipping(true);
      
      // At mid-point of animation, switch to the actual card
      const flipMidTimer = setTimeout(() => {
        console.log('Switching to actual card');
        setCardState('actual');
      }, 400); // Half of animation duration (ensure exact midpoint)
      
      // End the flip animation
      const flipEndTimer = setTimeout(() => {
        console.log('Ending flip animation');
        setIsFlipping(false);
        setFlipAnimationPlayed(true); // Mark that we've played the animation
      }, 800);
      
      return () => {
        clearTimeout(flipMidTimer);
        clearTimeout(flipEndTimer);
      };
    }
  }, [props.revealAll, cardState, flipAnimationPlayed, props.cards.length]);

  // Reset animation state when dealing new cards
  useEffect(() => {
    if (props.cards.length === 0) {
      console.log('Resetting animation state');
      setIsFlipping(false);
      setCardState('flipped');
      setFlipAnimationPlayed(false);
    }
  }, [props.cards.length]);

  // Calculate dynamic overlap based on card count
  const getOverlap = (totalCards: number, index: number) => {
    if (index === 0) return 0; // First card has no overlap
    
    // Base overlap for 2-3 cards
    let overlap = -60;
    
    // Increase overlap as more cards are added
    if (totalCards > 3) {
      // More aggressive overlap for more cards
      overlap = -100;
    }
    
    return overlap;
  };

  return (
    <view className="dealerHandContainer">
      <view className="dealerCardArea">
        {props.cards.map((card, index) => {
          // Determine the animation class for this card
          let animationClass = '';
          
          if (showAnimation) {
            // Only animate initial deal or new cards being added
            if (index < 2 && lastCardIndex < 2) {
              // Initial two cards animation
              animationClass = `deal-animation-${index + 1}`;
            } else if (index === lastCardIndex && index >= 2) {
              // Only the newest card gets the animation
              animationClass = 'dealer-new-card';
            }
          }
          
          // Add flip animation class to second card when revealing
          if (index === 1 && isFlipping) {
            // Only add flip animation for the hole card when revealing
            animationClass = 'card-flip'; // Note: overwrites other animations
          }
          
          // Calculate dynamic margin for this card
          const marginLeft = getOverlap(props.cards.length, index);
          
          // Determine card type for rendering
          const cardType = index === 1 && cardState === 'flipped' ? 'flipped' : card.suit;
          
          return (
            <view 
              key={`dealer-card-${index}`}
              className={`dealerCard ${animationClass}`}
              style={{ 
                zIndex: index,
                marginLeft: `${marginLeft}px`
              }}
            >
              <PlayingCard
                value={card.value}
                type={cardType}
                width={40}
              />
            </view>
          );
        })}
      </view>
    </view>
  );
}