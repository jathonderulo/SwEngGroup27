import React from 'react';
import Avatar from 'avataaars';
import '../styles/AiAvatar.css';
import shirt from './white_t.png';

export default function AiAvatar() {
  return (
    <div className="container-avatar">
      <Avatar 
        style={{width: '100%', height: '100%'}}
        // Assuming Avatar accepts a `style` prop for its sizing
      />
      <img src={shirt} className="tshirt-image" alt="T-shirt" />
    </div>
  );
}
