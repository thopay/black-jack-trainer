import { useCallback, useEffect, useState } from '@lynx-js/react';
import DealerHand from './components/DealerHand.jsx';
import PlayerHand from './components/PlayerHand.jsx';
import PlayerChoices from './components/PlayerChoices.jsx';
import { BlackjackDeck, type Card } from './utilities/Blackjack.js';
import { BlackjackStrategy, type BlackjackMove } from './utilities/BlackjackStrategy.js';

import './App.css';

export function App() {
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [correct, setCorrect] = useState<boolean>(false);
  const [showCorrect, setShowCorrect] = useState<boolean>(false);
  const [processingChoice, setProcessingChoice] = useState<boolean>(false);
  const [canSplit, setCanSplit] = useState<boolean>(false);
  const [lastMove, setLastMove] = useState<BlackjackMove | null>(null);
  const [correctMove, setCorrectMove] = useState<BlackjackMove | null>(null);
  const [animateCards, setAnimateCards] = useState(true);

  // Deal initial cards
  const dealNewHands = useCallback(() => {
    // First reset animation flag
    setAnimateCards(false);
    
    // Give a small delay to ensure animation reset
    setTimeout(() => {
      const deck = new BlackjackDeck();
      deck.reshuffle();

      const newDealerHand = deck.dealBlackjackHand();
      const newPlayerHand = deck.dealBlackjackHand();
      
      setDealerHand(newDealerHand);
      setPlayerHand(newPlayerHand);
      
      // Check if player can split (have same value cards)
      setCanSplit(BlackjackStrategy.isPair(newPlayerHand));
      
      // Reset move tracking
      setLastMove(null);
      setCorrectMove(null);
      
      // Trigger animations
      setAnimateCards(true);
    }, 50);
  }, []);

  // Load the game
  useEffect(() => {
    dealNewHands();
  }, [dealNewHands]);

  // Handle player choices and check if they are correct
  const handlePlayerChoice = useCallback(
    (choice: BlackjackMove) => {
      // Prevent multiple clicks while processing
      if (processingChoice) return;
      
      // Start processing
      setProcessingChoice(true);
      console.log('Player chose:', choice);
      
      // Store the player's move
      setLastMove(choice);
      
      // Get the correct move for this situation
      const recommendedMove = BlackjackStrategy.getRecommendedMove(
        playerHand, 
        dealerHand[0]
      ) as BlackjackMove;
      
      // Store the correct move
      setCorrectMove(recommendedMove);
      
      // Check if move is correct
      let isCorrect = BlackjackStrategy.isCorrectMove(
        choice, 
        playerHand, 
        dealerHand[0]
      );
      
      // Update state to show feedback
      setCorrect(isCorrect);
      setShowCorrect(true);

      // Delay before resetting or dealing new hands
      setTimeout(() => {
        if (isCorrect) {
          // Deal new hands if correct
          dealNewHands();
          // Wait a bit before allowing new choices (prevents rapid-fire clicking)
          setTimeout(() => {
            setShowCorrect(false);
            setProcessingChoice(false);
          }, 200);
        } else {
          // Just hide feedback if incorrect and allow new choice
          setShowCorrect(false);
          setProcessingChoice(false);
        }
      }, 1500); // Give users more time to see the feedback
    },
    [playerHand, dealerHand, processingChoice, dealNewHands],
  );

  // Wait for cards to be dealt
  if (dealerHand.length === 0 || playerHand.length === 0) {
    return (
      <view className="Loading">
        <text>Dealing cards...</text>
      </view>
    );
  }

  return (
    <view>
      <view className="App">
        <view className="DealerHand">
          <DealerHand cards={dealerHand} animate={animateCards} />
        </view>
        <view className='CorrectStatus'>
          <text className={correct ? 'CorrectMove' : 'IncorrectMove'}>
            {showCorrect ? (correct ? 'Correct!' : 'Not quite...') : ' '}
          </text>
        </view>
        <view className="PlayerHand">
          <PlayerHand cards={playerHand} animate={animateCards} />
        </view>
        <view className="PlayerChoices">
          <PlayerChoices
            hit={() => handlePlayerChoice('H')}
            stand={() => handlePlayerChoice('S')}
            doubleDown={() => handlePlayerChoice('D')}
            split={() => handlePlayerChoice('SP')}
            canSplit={canSplit}
            canDoubleDown={playerHand.length === 2}
            buttonsEnabled={!processingChoice}
            lastMove={lastMove}
            correctMove={correctMove}
          />
        </view>
      </view>
    </view>
  );
}