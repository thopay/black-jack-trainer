import PlayingCard from './PlayingCard.jsx';
import type { Card } from '../utilities/Blackjack.js';
import { useEffect, useState } from '@lynx-js/react';

import './PlayerHand.css';

export default function PlayerHand(props: {
  cards: Array<Card>;
  animate?: boolean;
}) {
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Trigger animation when cards change or when explicitly requested
  useEffect(() => {
    if (props.cards.length && (props.animate !== false)) {
      setShowAnimation(false);
      setTimeout(() => setShowAnimation(true), 10);
    }
  }, [props.cards, props.animate]);

  return (
    <view className="playerHandContainer">
      <view className="playerHand">
        {props.cards.map((card, index) => (
          <view 
            key={`player-card-${index}`}
            className={`playerCard ${showAnimation && index < 2 ? 
              `player-deal-animation-${index + 1}` : index >= 2 ? 'player-new-card' : ''}`}
            style={{ left: `${index * 30}px`, zIndex: index }}
          >
            <PlayingCard
              value={card.value}
              type={card.suit}
              width={42}
            />
          </view>
        ))}
      </view>
    </view>
  );
}