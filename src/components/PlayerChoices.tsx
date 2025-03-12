import Button from './Button.jsx';

import './PlayerChoices.css';

export default function PlayerChoices(props: {
  hit: Function;
  stand: Function;
  doubleDown: Function;
  split: Function;
  canSplit: boolean;
  canDoubleDown: boolean;
  buttonsEnabled?: boolean;
  lastMove?: 'H' | 'S' | 'D' | 'SP' | null;
  correctMove?: 'H' | 'S' | 'D' | 'SP' | null;
}) {
  // If buttonsEnabled is not provided, default to true
  const isEnabled = props.buttonsEnabled !== undefined ? props.buttonsEnabled : true;
  
  // Helper function to determine button status
  const getButtonStatus = (moveType: 'H' | 'S' | 'D' | 'SP') => {
    // If there's no last move, no special status
    if (!props.lastMove) return 'normal';
    
    // If this button is the last move and it's correct, show green
    if (props.lastMove === moveType && props.lastMove === props.correctMove) {
      return 'correct';
    }
    
    // If this button is the last move but incorrect, show yellow
    if (props.lastMove === moveType && props.lastMove !== props.correctMove) {
      return 'incorrect';
    }
    
    // Don't highlight the correct move if player chose wrong
    // Just return normal for all other buttons
    return 'normal';
  };
  
  return (
    <view className="playerChoices">
      <view className="choiceRow">
        <Button 
          text="Double" 
          onClick={props.doubleDown} 
          enabled={isEnabled && props.canDoubleDown} 
          status={getButtonStatus('D')}
        />
        <Button 
          text="Hit" 
          onClick={props.hit} 
          enabled={isEnabled} 
          status={getButtonStatus('H')}
        />
      </view>
      <view className="choiceRow">
        <Button 
          text="Split" 
          onClick={props.split} 
          enabled={isEnabled && props.canSplit} 
          status={getButtonStatus('SP')}
        />
        <Button 
          text="Stand" 
          onClick={props.stand} 
          enabled={isEnabled} 
          status={getButtonStatus('S')}
        />
      </view>
    </view>
  );
}