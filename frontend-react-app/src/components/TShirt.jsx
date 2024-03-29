import React from 'react';
import '../styles/TShirt.css'; // Make sure to create a CSS file with this name

const TShirt = () => {
  return (
    <div className="tshirt-container">
      <div className="tshirt-body"></div>
      <div className="tshirt-sleeve left-sleeve"></div>
      <div className="tshirt-sleeve right-sleeve"></div>
      <div className="tshirt-neck"></div>
    </div>
  );
}

export default TShirt;
