import PlayingCard from './PlayingCard.jsx';
import type { Card } from '../utilities/Blackjack.js';
import { useEffect, useState } from 'react';

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
    <view className="playerHand">
      <view className={`playerCard ${showAnimation ? 'player-deal-animation-1' : ''}`}>
        <PlayingCard
          value={props.cards[0].value}
          type={props.cards[0].suit}
          width={42}
        />
      </view>
      <view className={`playerCard ${showAnimation ? 'player-deal-animation-2' : ''}`}>
        <PlayingCard
          value={props.cards[1].value}
          type={props.cards[1].suit}
          width={42}
        />
      </view>
    </view>
  );
}