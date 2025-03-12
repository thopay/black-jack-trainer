import PlayingCard from './PlayingCard.jsx';
import type { Card } from '../utilities/Blackjack.js';

import './DealerHand.css';

export default function DealerHand(props: {
	  cards: Array<Card>;
}) {
  return (
    <view className="Hand">
      <view className="card1">
        <PlayingCard
          value={props.cards[0].value}
          type={props.cards[0].suit}
          width={50}
        />
      </view>
      <view className="card2">
        <PlayingCard
          value={props.cards[1].value}
          type={'flipped'}
          width={50}
        />
      </view>
    </view>
  );
}
