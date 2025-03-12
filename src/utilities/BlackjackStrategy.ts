import type { Card, CardValue } from "./Blackjack.js";

// Define possible moves in blackjack (simplified)
type BlackjackMove = 'H' | 'S' | 'D' | 'SP';

class BlackjackStrategy {
  // Determine if hand is a pair
  static isPair(hand: Card[]): boolean {
    if (hand.length !== 2) return false;
    return hand[0].value === hand[1].value;
  }

  // Determine if hand is soft (contains an Ace counted as 11)
  static isSoft(hand: Card[]): boolean {
    // Check if hand contains an Ace
    const hasAce = hand.some((card) => card.value === 'A');
    if (!hasAce) return false;

    // Calculate sum without treating Ace as 11
    const sum = hand.reduce((total, card) => {
      return total + (card.value === 'A' ? 1 : card.numericValue);
    }, 0);

    // If sum + 10 (for one Ace as 11) <= 21, then it's a soft hand
    return sum + 10 <= 21;
  }

  // Get hand total, accounting for soft hands
  static getHandTotal(hand: Card[]): number {
    let total = hand.reduce((sum, card) => sum + card.numericValue, 0);

    // Adjust for Aces if needed
    const aceCount = hand.filter((card) => card.value === 'A').length;
    let remainingAces = aceCount;

    while (total > 21 && remainingAces > 0) {
      total -= 10; // Convert an Ace from 11 to 1
      remainingAces--;
    }

    return total;
  }

  // Get recommended move based on perfect strategy (simplified)
  static getRecommendedMove(
    playerHand: Card[],
    dealerUpcard: Card,
    doubleAllowed: boolean = true
  ): BlackjackMove {
    const dealerValue = dealerUpcard.value;

    // Special case for player blackjack
    if (playerHand.length === 2 && this.getHandTotal(playerHand) === 21) {
      return 'S'; // Always stand on blackjack
    }

    // Check if it's a pair
    if (this.isPair(playerHand)) {
      const pairResult = this.getPairDecision(playerHand[0].value, dealerValue);
      // Map old notation to new simplified moves
      return pairResult === 'Y' ? 'SP' : 
             pairResult === 'N' ? this.getBasicStrategyWithoutSplit(playerHand, dealerUpcard, doubleAllowed) : 
             'H'; // Default to hit for edge cases
    }

    // If not a pair, use basic strategy
    return this.getBasicStrategyWithoutSplit(playerHand, dealerUpcard, doubleAllowed);
  }

  // Basic strategy for non-pair hands
  private static getBasicStrategyWithoutSplit(
    playerHand: Card[],
    dealerUpcard: Card,
    doubleAllowed: boolean
  ): BlackjackMove {
    const dealerValue = dealerUpcard.value;
    
    // Check if it's a soft hand
    if (this.isSoft(playerHand)) {
      return this.getSoftTotalDecision(playerHand, dealerValue, doubleAllowed);
    }

    // Hard total
    const playerTotal = this.getHandTotal(playerHand);
    return this.getHardTotalDecision(playerTotal, dealerValue, doubleAllowed);
  }

  // Hard totals decisions
  private static getHardTotalDecision(
    playerTotal: number,
    dealerValue: CardValue,
    doubleAllowed: boolean
  ): BlackjackMove {
    // Handle hard totals based on chart
    if (playerTotal >= 17) {
      return 'S'; // Always stand on 17+
    } else if (playerTotal <= 8) {
      return 'H'; // Always hit on 8 or less
    } else if (playerTotal === 11) {
      return doubleAllowed ? 'D' : 'H'; // Double on 11 if allowed, otherwise hit
    } else if (playerTotal === 10) {
      return (dealerValue === '10' || dealerValue === 'A') ? 'H' : 
              doubleAllowed ? 'D' : 'H';
    } else if (playerTotal === 9) {
      return (dealerValue >= '3' && dealerValue <= '6') ? 
              doubleAllowed ? 'D' : 'H' : 'H';
    } else if (playerTotal === 12) {
      return (dealerValue >= '4' && dealerValue <= '6') ? 'S' : 'H';
    } else if (playerTotal >= 13 && playerTotal <= 16) {
      return (dealerValue >= '2' && dealerValue <= '6') ? 'S' : 'H';
    }

    // Default to hit (should not reach here with proper inputs)
    return 'H';
  }

  // Soft totals decisions
  private static getSoftTotalDecision(
    hand: Card[],
    dealerValue: CardValue,
    doubleAllowed: boolean
  ): BlackjackMove {
    // Calculate the total excluding the Ace's 10 extra points
    const nonAceSum = hand.reduce((sum, card) => {
      return sum + (card.value === 'A' ? 1 : card.numericValue);
    }, 0);

    // Map to A,x format for lookup
    const softTotal = nonAceSum;

    // A,9 or A,8 (soft 19 or 20)
    if (softTotal >= 9) {
      return 'S'; // Always stand
    }

    // A,7 (soft 18)
    if (softTotal === 8) {
      // Stand against 2, 7, 8
      if (dealerValue === '2' || dealerValue === '7' || dealerValue === '8') {
        return 'S';
      }
      // Double against 3-6 if allowed
      else if (dealerValue >= '3' && dealerValue <= '6') {
        return doubleAllowed ? 'D' : 'S';
      }
      // Hit against 9, 10, A
      else {
        return 'H';
      }
    }

    // A,6 (soft 17)
    if (softTotal === 7) {
      // Double against 3-6 if allowed, otherwise hit
      if (dealerValue >= '3' && dealerValue <= '6') {
        return doubleAllowed ? 'D' : 'H';
      }
      return 'H'; // Hit otherwise
    }

    // A,5 or A,4 (soft 16 or 15)
    if (softTotal === 6 || softTotal === 5) {
      // Double against 4-6 if allowed, otherwise hit
      if (dealerValue >= '4' && dealerValue <= '6') {
        return doubleAllowed ? 'D' : 'H';
      }
      return 'H'; // Hit otherwise
    }

    // A,3 or A,2 (soft 14 or 13)
    if (softTotal === 4 || softTotal === 3) {
      // Double against 5-6 if allowed, otherwise hit
      if (dealerValue === '5' || dealerValue === '6') {
        return doubleAllowed ? 'D' : 'H';
      }
      return 'H'; // Hit otherwise
    }

    // Default to hit for other soft hands
    return 'H';
  }

  // Pair decisions (simplified to return 'Y' for split, 'N' for don't split)
  private static getPairDecision(
    cardValue: CardValue,
    dealerValue: CardValue
  ): 'Y' | 'N' {
    // Special cases for each pair
    switch (cardValue) {
      case 'A':
      case '8':
        return 'Y'; // Always split aces and 8s

      case 'K':
      case 'Q':
      case 'J':
      case '10':
      case '5':
        return 'N'; // Never split tens/face cards or 5s

      case '9':
        // Split 9s against 2-6, 8-9
        return (dealerValue === '7' || dealerValue === '10' || dealerValue === 'A') ? 'N' : 'Y';

      case '7':
        // Split 7s against 2-7
        return (dealerValue >= '8') ? 'N' : 'Y';

      case '6':
        // Split 6s against 2-6
        return (dealerValue >= '7') ? 'N' : 'Y';

      case '4':
        // Split 4s only against 5-6
        return (dealerValue === '5' || dealerValue === '6') ? 'Y' : 'N';

      case '3':
      case '2':
        // Split 2s/3s against 2-7
        return (dealerValue >= '8') ? 'N' : 'Y';

      default:
        return 'N'; // Default case
    }
  }

  // Check if player's move matches the recommended move
  static isCorrectMove(
    playerMove: BlackjackMove,
    playerHand: Card[],
    dealerUpcard: Card,
    doubleAllowed: boolean = true
  ): boolean {
    const recommendedMove = this.getRecommendedMove(
      playerHand,
      dealerUpcard,
      doubleAllowed
    );

    // Direct match
    if (playerMove === recommendedMove) return true;

    // Handle special case for double
    if (recommendedMove === 'D' && !doubleAllowed && playerMove === 'H')
      return true;

    return false;
  }
  
  // Helper method to convert strategy into human-readable format
  static getStrategyDescription(playerHand: Card[], dealerUpcard: Card): string {
    const move = this.getRecommendedMove(playerHand, dealerUpcard);
    const handTotal = this.getHandTotal(playerHand);
    const isPair = this.isPair(playerHand);
    const isSoft = this.isSoft(playerHand);
    
    let description = "";
    
    if (isPair) {
      const pairValue = playerHand[0].value;
      description = `With a pair of ${pairValue}s against dealer's ${dealerUpcard.value}, `;
      description += move === 'SP' ? "you should split." : "you should not split.";
    } else if (isSoft) {
      description = `With a soft ${handTotal} against dealer's ${dealerUpcard.value}, `;
      if (move === 'H') description += "you should hit.";
      else if (move === 'S') description += "you should stand.";
      else if (move === 'D') description += "you should double down.";
    } else {
      description = `With a hard ${handTotal} against dealer's ${dealerUpcard.value}, `;
      if (move === 'H') description += "you should hit.";
      else if (move === 'S') description += "you should stand.";
      else if (move === 'D') description += "you should double down.";
    }
    
    return description;
  }
}

export { BlackjackStrategy };
export type { BlackjackMove };