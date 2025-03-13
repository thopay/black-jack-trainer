import { useCallback, useEffect, useState } from '@lynx-js/react';
import DealerHand from './components/DealerHand.jsx';
import PlayerHand from './components/PlayerHand.jsx';
import PlayerChoices from './components/PlayerChoices.jsx';
import { BlackjackDeck, type Card } from './utilities/Blackjack.js';
import { BlackjackStrategy, type BlackjackMove } from './utilities/BlackjackStrategy.js';
import ToggleSwitch from './components/ToggleSwitch.jsx';

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
  const [playThroughMode, setPlayThroughMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [gameState, setGameState] = useState<'initial' | 'playing' | 'result'>('initial');
  const [deck, setDeck] = useState<BlackjackDeck | null>(null);
  const [playerBusted, setPlayerBusted] = useState(false);
  const [dealerBusted, setDealerBusted] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'push' | null>(null);
  const [dealerCardsRevealed, setDealerCardsRevealed] = useState(false);
  const [playerBlackjack, setPlayerBlackjack] = useState(false);
  const [dealerBlackjack, setDealerBlackjack] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Check for blackjack
  const checkForBlackjack = useCallback((hand: Card[]) => {
    return hand.length === 2 && BlackjackDeck.calculateHandValue(hand).total === 21;
  }, []);

  // Deal initial cards
  const dealNewHands = useCallback(() => {
    // First reset animation flag and clear all hands
    setAnimateCards(false);
    setDealerHand([]);
    setPlayerHand([]);
    
    // Reset game state
    setGameState('initial');
    setPlayerBusted(false);
    setDealerBusted(false);
    setGameResult(null);
    setDealerCardsRevealed(false);
    setPlayerBlackjack(false);
    setDealerBlackjack(false);
    setStatusMessage('');
    
    // Give a small delay to ensure animation reset
    setTimeout(() => {
      const newDeck = new BlackjackDeck();
      newDeck.reshuffle();
      setDeck(newDeck);
  
      const newDealerHand = newDeck.dealBlackjackHand();
      const newPlayerHand = newDeck.dealBlackjackHand();
      
      // Set new hands
      setDealerHand(newDealerHand);
      setPlayerHand(newPlayerHand);
      
      // Check if player can split (have same value cards)
      setCanSplit(BlackjackStrategy.isPair(newPlayerHand));
      
      // Reset move tracking
      setLastMove(null);
      setCorrectMove(null);
      
      // Check for blackjacks
      const hasPlayerBlackjack = checkForBlackjack(newPlayerHand);
      const hasDealerBlackjack = checkForBlackjack(newDealerHand);
      
      setPlayerBlackjack(hasPlayerBlackjack);
      setDealerBlackjack(hasDealerBlackjack);
      
      // Handle blackjack scenarios in play through mode
      if (playThroughMode && (hasPlayerBlackjack || hasDealerBlackjack)) {
        setTimeout(() => {
          handleBlackjackScenario(hasPlayerBlackjack, hasDealerBlackjack);
        }, 1000);
      } else if (hasPlayerBlackjack) {
        setStatusMessage('Blackjack! (Stand is always correct)');
      }
      
      // Trigger animations with a slightly longer delay
      setTimeout(() => {
        setAnimateCards(true);
      }, 50);
    }, 150); // Longer delay for more reliable reset
  }, [checkForBlackjack, playThroughMode]);

  // Handle blackjack scenario
  const handleBlackjackScenario = useCallback((playerHasBlackjack: boolean, dealerHasBlackjack: boolean) => {
    setDealerCardsRevealed(true);
    
    setTimeout(() => {
      if (playerHasBlackjack && dealerHasBlackjack) {
        // Both have blackjack - push
        setStatusMessage('Both have Blackjack!');
        setGameResult('push');
      } else if (playerHasBlackjack) {
        // Player has blackjack, dealer doesn't - player wins
        setStatusMessage('Blackjack! You win 3:2');
        setGameResult('win');
      } else if (dealerHasBlackjack) {
        // Dealer has blackjack, player doesn't - dealer wins
        setStatusMessage('Dealer has Blackjack!');
        setGameResult('lose');
      }
      
      // Finish the game after showing result
      setTimeout(() => {
        dealNewHands();
      }, 2500);
    }, 1000);
  }, [dealNewHands]);

  // Load the game
  useEffect(() => {
    dealNewHands();
    setLoading(false);
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

      // In play through mode, we continue the hand if the move is correct
      if (playThroughMode && isCorrect) {
        setGameState('playing');
        handlePlayThroughAction(choice);
      } else {
        // Regular trainer mode behavior
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
      }
    },
    [playerHand, dealerHand, processingChoice, dealNewHands, playThroughMode],
  );

  // Handle play through mode actions
  const handlePlayThroughAction = useCallback((action: BlackjackMove) => {
    if (!deck) return;
    
    // Handle different actions in play through mode
    switch (action) {
      case 'H': // Hit
        setTimeout(() => {
          const newCard = deck.dealCard();
          if (newCard) {
            const updatedHand = [...playerHand, newCard];
            setPlayerHand(updatedHand);
            
            // Reset move highlights after dealing a new card
            setLastMove(null);
            setCorrectMove(null);
            
            // Check if busted
            const handValue = BlackjackDeck.calculateHandValue(updatedHand).total;
            if (handValue > 21) {
              setPlayerBusted(true);
              setStatusMessage('Busted!');
              finishHand();
            } else {
              // Can continue playing
              setShowCorrect(false);
              setProcessingChoice(false);
            }
          }
        }, 800);
        break;
        
      case 'S': // Stand
        finishHand();
        break;
        
      case 'D': // Double down
        setTimeout(() => {
          const newCard = deck.dealCard();
          if (newCard) {
            const updatedHand = [...playerHand, newCard];
            setPlayerHand(updatedHand);
            
            // Reset move highlights
            setLastMove(null);
            setCorrectMove(null);
            
            // After double down, automatically stand
            const handValue = BlackjackDeck.calculateHandValue(updatedHand).total;
            if (handValue > 21) {
              setPlayerBusted(true);
              setStatusMessage('Busted on double down!');
            }
            finishHand();
          }
        }, 800);
        break;
        
      case 'SP': // Split (simplified - just deal new hands for now)
        dealNewHands();
        setProcessingChoice(false);
        break;
    }
  }, [deck, playerHand, dealNewHands]);

  // Play dealer's hand and determine outcome
  const finishHand = useCallback(() => {
    setGameState('result');
    setDealerCardsRevealed(true);
    
    setTimeout(() => {
      if (!deck) return;
      
      let currentDealerHand = [...dealerHand];
      const playerTotal = BlackjackDeck.calculateHandValue(playerHand).total;
      
      // If player busted, dealer automatically wins
      if (playerTotal > 21) {
        setGameResult('lose');
        finishGame();
        return;
      }
      
      // Dealer draws cards until 17 or higher
      setTimeout(() => {
        let dealerValue = BlackjackDeck.calculateHandValue(currentDealerHand).total;
        
        const dealerDraws = async () => {
          while (dealerValue < 17) {
            const newCard = deck.dealCard();
            if (!newCard) break;
            
            currentDealerHand = [...currentDealerHand, newCard];
            setDealerHand(currentDealerHand);
            
            dealerValue = BlackjackDeck.calculateHandValue(currentDealerHand).total;
            
            // Add a delay between dealer cards
            await new Promise(resolve => setTimeout(resolve, 800));
          }
          
          // Determine result
          if (dealerValue > 21) {
            setDealerBusted(true);
            setStatusMessage('Dealer busts!');
            setGameResult('win');
          } else if (dealerValue > playerTotal) {
            setStatusMessage(`Dealer has ${dealerValue}, you have ${playerTotal}`);
            setGameResult('lose');
          } else if (dealerValue < playerTotal) {
            setStatusMessage(`You have ${playerTotal}, dealer has ${dealerValue}`);
            setGameResult('win');
          } else {
            setStatusMessage(`Push - both have ${playerTotal}`);
            setGameResult('push');
          }
          
          finishGame();
        };
        
        dealerDraws();
      }, 800);
    }, 800);
  }, [deck, dealerHand, playerHand]);

  // End the game and prep for next round
  const finishGame = useCallback(() => {
    setTimeout(() => {
      setShowCorrect(false);
      setProcessingChoice(false);
      
      // Wait to show the result before dealing new hands
      setTimeout(() => {
        dealNewHands();
      }, 2000);
    }, 1500);
  }, [dealNewHands]);

  // Toggle play through mode
  const togglePlayThroughMode = useCallback(() => {
    setPlayThroughMode(!playThroughMode);
    dealNewHands(); // Reset the game when changing modes
  }, [playThroughMode, dealNewHands]);

  // Wait for cards to be dealt
  if (loading) {
    return (
      <view className="Loading">
        <text>Dealing cards...</text>
      </view>
    );
  }

  return (
    <view>
      <view className="App">
        <view className="Header">
          <view className="Title">
            <text>Blackjack Trainer</text>
          </view>
          <view className="PlayThroughToggle">
            <text>Play Through:</text>
            <ToggleSwitch isOn={playThroughMode} onToggle={togglePlayThroughMode} />
          </view>
        </view>
        
        <view className="DealerHand">
          <DealerHand 
            cards={dealerHand} 
            animate={animateCards} 
            revealAll={dealerCardsRevealed || dealerBlackjack}
          />
        </view>
        
        <view className='GameStatus'>
          {statusMessage ? (
            <text className={`GameMessage ${
              statusMessage.includes('Busted') ? 'PlayerBusted' :
              statusMessage.includes('Blackjack! You win') ? 'PlayerWins' :
              statusMessage.includes('Dealer busts') ? 'PlayerWins' :
              statusMessage.includes('Both have Blackjack') ? 'GamePush' :
              statusMessage.includes('Push') ? 'GamePush' :
              statusMessage.includes('Dealer has Blackjack') ? 'DealerWins' :
              gameResult === 'win' ? 'PlayerWins' :
              gameResult === 'lose' ? 'DealerWins' : ''
            }`}>
              {statusMessage}
            </text>
          ) : gameResult ? (
            <text className={`GameResult ${gameResult === 'win' ? 'PlayerWins' : 
                               gameResult === 'lose' ? 'DealerWins' : 'GamePush'}`}>
              {gameResult === 'win' ? 'You Win!' : 
               gameResult === 'lose' ? 'Dealer Wins' : 'Push'}
            </text>
          ) : (
            <text className={correct ? 'CorrectMove' : 'IncorrectMove'}>
              {showCorrect ? (correct ? 'Correct!' : 'Not quite...') : ' '}
            </text>
          )}
        </view>
        
        <view className="PlayerHand">
          <PlayerHand 
            cards={playerHand} 
            animate={animateCards} 
          />
        </view>
        
        <view className="PlayerChoices">
          <PlayerChoices
            hit={() => handlePlayerChoice('H')}
            stand={() => handlePlayerChoice('S')}
            doubleDown={() => handlePlayerChoice('D')}
            split={() => handlePlayerChoice('SP')}
            canSplit={canSplit}
            canDoubleDown={playerHand.length === 2}
            buttonsEnabled={!processingChoice && (gameState !== 'result') && !playerBlackjack}
            lastMove={lastMove}
            correctMove={correctMove}
          />
        </view>
      </view>
    </view>
  );
}