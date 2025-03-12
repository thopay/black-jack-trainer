import PlayingCard from './PlayingCard.jsx';
import type { Card } from '../utilities/Blackjack.js';
import { useEffect, useState } from '@lynx-js/react';

import './DealerHand.css';

export default function DealerHand(props: {
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
    <view className="Hand">
      <view className={`card1 ${showAnimation ? 'deal-animation-1' : ''}`}>
        <PlayingCard
          value={props.cards[0].value}
          type={props.cards[0].suit}
          width={50}
        />
      </view>
      <view className={`card2 ${showAnimation ? 'deal-animation-2' : ''}`}>
        <PlayingCard
          value={props.cards[1].value}
          type={'flipped'}
          width={50}
        />
      </view>
    </view>
  );
}