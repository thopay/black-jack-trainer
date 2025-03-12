import PlayingCard from './PlayingCard.jsx';
import type { Card } from '../utilities/Blackjack.js';
import { useEffect, useState } from '@lynx-js/react';

import './DealerHand.css';

export default function DealerHand(props: {
    cards: Array<Card>;
    animate?: boolean;
    revealAll?: boolean;
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
    if (props.cards.length && (props.animate !== false)) {
      setShowAnimation(false);
      setTimeout(() => setShowAnimation(true), 10);
    }
  }, [props.cards, props.animate]);

  return (
    <view className="dealerHandContainer">
      <view className="dealerCardArea">
        {props.cards.map((card, index) => {
          // Determine the animation class for this card
          let animationClass = '';
          
          if (showAnimation) {
            if (index < 2 && lastCardIndex < 2) {
              // Initial two cards animation
              animationClass = `deal-animation-${index + 1}`;
            } else if (index === lastCardIndex && index >= 2) {
              // Only the newest card gets the animation
              animationClass = 'dealer-new-card';
            }
          }
          
          // Use negative margins for overlapping
          return (
            <view 
              key={`dealer-card-${index}`}
              className={`dealerCard ${animationClass}`}
              style={{ 
                zIndex: index,
                marginLeft: index === 0 ? '0' : '-60px'  // Overlap cards
              }}
            >
              <PlayingCard
                value={card.value}
                type={index === 1 && !props.revealAll ? 'flipped' : card.suit}
                width={50}
              />
            </view>
          );
        })}
      </view>
    </view>
  );
}