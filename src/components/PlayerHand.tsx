import PlayingCard from './PlayingCard.jsx';
import type { Card } from '../utilities/Blackjack.js';

import './PlayerHand.css';

export default function PlayerHand(props: {
	cards: Array<Card>;
}) {
  return (
	<view className="playerHand">
	  <view className="playerCard">
		<PlayingCard
		  value={props.cards[0].value}
		  type={props.cards[0].suit}
		  width={42}
		/>
	  </view>
	  <view className="playerCard">
		<PlayingCard
		  value={props.cards[1].value}
		  type={props.cards[1].suit}
		  width={42}
		/>
	  </view>
	</view>
  );
}
