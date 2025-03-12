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
    if (props.cards.length && (props.animate !== false)) {
      setShowAnimation(false);
      setTimeout(() => setShowAnimation(true), 10);
    }
  }, [props.cards, props.animate]);

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
          
          // Use negative margins for overlapping
          return (
            <view 
              key={`player-card-${index}`}
              className={`playerCard ${animationClass}`}
              style={{ 
                zIndex: index,
                marginLeft: index === 0 ? '0' : '-60px'  // Overlap cards
              }}
            >
              <PlayingCard
                value={card.value}
                type={card.suit}
                width={42}
              />
            </view>
          );
        })}
      </view>
    </view>
  );
}