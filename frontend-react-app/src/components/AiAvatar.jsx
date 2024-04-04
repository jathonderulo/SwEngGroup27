import React from 'react';
import Avatar from 'avataaars';
import '../styles/AiAvatar.css';
import shirt from './white_t.png';

export default function AiAvatar() {
  return (
    <div className="container-avatar" style={{ position: 'relative' }}>
      <Avatar 
        style={{ width: '100%', height: '100%' }}
        // Assuming Avatar accepts a `style` prop for its sizing
      />
      <img src={shirt} className="tshirt-image" alt="T-shirt" />
      <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 1 }}>
        <p style={{ color: 'black', fontSize: '16px' }}>Your Text Here</p>
      </div>
    </div>
  );
}
