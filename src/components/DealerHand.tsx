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
  
  // Trigger animation when cards change or when explicitly requested
  useEffect(() => {
    if (props.cards.length && (props.animate !== false)) {
      setShowAnimation(false);
      setTimeout(() => setShowAnimation(true), 10);
    }
  }, [props.cards, props.animate]);

  return (
    <view className="dealerHandContainer">
      <view className="dealerHand">
        {props.cards.map((card, index) => (
          <view 
            key={`dealer-card-${index}`}
            className={`dealerCard ${showAnimation && index < 2 ? 
              `deal-animation-${index + 1}` : index >= 2 ? 'dealer-new-card' : ''}`}
            style={{ left: `${index * 30}px`, zIndex: index }}
          >
            <PlayingCard
              value={card.value}
              type={index === 1 && !props.revealAll ? 'flipped' : card.suit}
              width={50}
            />
          </view>
        ))}
      </view>
    </view>
  );
}