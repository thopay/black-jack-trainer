// Define card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
type Card = {
  value: CardValue;
  suit: Suit;
  numericValue: number; // The blackjack value of the card
};

class BlackjackDeck {
  private cards: Card[] = [];
  private readonly suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  private readonly values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  constructor() {
    this.initializeDeck();
    this.shuffle();
  }

  private initializeDeck(): void {
    this.cards = [];
    for (const suit of this.suits) {
      for (const value of this.values) {
        // Calculate numeric value for Blackjack
        let numericValue: number;
        if (value === 'A') {
          numericValue = 11; // Ace is 11 by default (can be reduced to 1 in game logic)
        } else if (value === 'J' || value === 'Q' || value === 'K') {
          numericValue = 10; // Face cards are worth 10
        } else {
          numericValue = parseInt(value); // Number cards are worth their face value
        }
        
        this.cards.push({ value, suit, numericValue });
      }
    }
  }

  private shuffle(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // Deal a single card
  dealCard(): Card | null {
    if (this.cards.length === 0) {
      console.warn('Deck is empty!');
      return null;
    }
    return this.cards.pop()!;
  }

  // Deal multiple cards at once
  dealCards(count: number): Card[] {
    const dealt: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.dealCard();
      if (card) dealt.push(card);
    }
    return dealt;
  }

  // Deal a starting hand for blackjack (2 cards)
  dealBlackjackHand(): Card[] {
    return this.dealCards(2);
  }

  // Get remaining cards count
  getRemainingCount(): number {
    return this.cards.length;
  }

  // Reshuffle the deck (recreate and shuffle)
  reshuffle(): void {
    this.initializeDeck();
    this.shuffle();
  }

  // Calculate the value of a blackjack hand
  static calculateHandValue(hand: Card[]): { total: number, soft: boolean } {
    let total = 0;
    let aceCount = 0;
    
    // Sum up all cards
    for (const card of hand) {
      if (card.value === 'A') {
        aceCount++;
      }
      total += card.numericValue;
    }
    
    // Handle aces to prevent busting when possible
    let soft = false;
    while (total > 21 && aceCount > 0) {
      total -= 10; // Convert an Ace from 11 to 1
      aceCount--;
      soft = true;
    }
    
    return { total, soft };
  }
}

// Export the class
export { BlackjackDeck };
export type { Card, CardValue, Suit };

// // Example usage:
// function playBlackjack() {
//   const deck = new BlackjackDeck();
  
//   // Deal hands
//   const playerHand = deck.dealBlackjackHand();
//   const dealerHand = deck.dealBlackjackHand();
  
//   console.log('Player hand:', playerHand);
//   console.log('Player score:', BlackjackDeck.calculateHandValue(playerHand));
  
//   console.log('Dealer hand:', dealerHand);
//   console.log('Dealer score:', BlackjackDeck.calculateHandValue(dealerHand));
  
//   // Hit (draw another card)
//   const newCard = deck.dealCard();
//   if (newCard) {
//     console.log('Player hits and gets:', newCard);
//     playerHand.push(newCard);
//     console.log('New player score:', BlackjackDeck.calculateHandValue(playerHand));
//   }
// }

// // Run the example
// playBlackjack();