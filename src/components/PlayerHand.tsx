import PlayingCard from './PlayingCard.jsx';
import type { Card } from '../utilities/Blackjack.js';
import { useEffect, useState } from 'react';

import './PlayerHand.css';

export default function PlayerHand(props: {
  cards: Array<Card>;
  animate?: boolean;
}) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastCardIndex, setLastCardIndex] = useState(-1);
  
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

  // Calculate dynamic overlap based on card count
  const getOverlap = (totalCards: number, index: number) => {
    if (index === 0) return 0; // First card has no overlap
    
    // Base overlap for 2-3 cards
    let overlap = -60;
    
    // Increase overlap as more cards are added
    if (totalCards > 3) {
      // More aggressive overlap for more cards
      overlap = -90;
    }
    
    return overlap;
  };

  return (
    <view className="playerHandContainer">
      <view className="playerCardArea">
        {props.cards.map((card, index) => {
          // Determine the animation class for this card
          let animationClass = '';
          
          if (showAnimation) {
            if (index < 2 && lastCardIndex < 2) {
              // Initial two cards animation
              animationClass = `player-deal-animation-${index + 1}`;
            } else if (index === lastCardIndex && index >= 2) {
              // Only the newest card gets the animation
              animationClass = 'player-new-card';
            }
          }
          
          // Calculate dynamic margin for this card
          const marginLeft = getOverlap(props.cards.length, index);
          
          return (
            <view 
              key={`player-card-${index}`}
              className={`playerCard ${animationClass}`}
              style={{ 
                zIndex: index,
                marginLeft: `${marginLeft}px`
              }}
            >
              <PlayingCard
                value={card.value}
                type={card.suit}
                width={38}
              />
            </view>
          );
        })}
      </view>
    </view>
  );
}