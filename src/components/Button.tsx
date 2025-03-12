import { useState } from 'react';
import './Button.css';

export default function Button(props: { 
  text: String; 
  onClick: Function, 
  enabled: boolean, 
  status?: 'normal' | 'correct' | 'incorrect' 
}) {
  // State to track if button is being pressed
  const [isPressed, setIsPressed] = useState(false);
  
  // Determine which class to use based on enabled state, pressed state, and status
  let buttonClass = props.enabled ? 'playerButton' : 'buttonDisabled';
  
  // Add pressed class if being pressed
  if (isPressed && props.enabled) {
    buttonClass += ' pressed';
  }
  
  // Add correct/incorrect classes based on status
  if (props.status === 'correct') {
    buttonClass += ' correctButton';
  } else if (props.status === 'incorrect') {
    buttonClass += ' incorrectButton';
  }
  
  return (
    <view 
      bindtap={() => props.enabled && props.onClick()}
      bindtouchstart={() => props.enabled && setIsPressed(true)}
      bindtouchend={() => setIsPressed(false)}
      bindtouchcancel={() => setIsPressed(false)}
      className={buttonClass}
    >
      <text className='buttonText'>{props.text}</text>
    </view>
  );
}