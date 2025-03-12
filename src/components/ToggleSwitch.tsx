import { useState } from '@lynx-js/react';
import './ToggleSwitch.css';

export default function ToggleSwitch(props: { 
  isOn: boolean;
  onToggle: Function;
}) {
  return (
    <view 
      className={`toggle-switch ${props.isOn ? 'on' : 'off'}`}
      bindtap={() => props.onToggle()}
    >
      <view className="toggle-slider" />
    </view>
  );
}