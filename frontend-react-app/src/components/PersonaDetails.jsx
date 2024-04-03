import React, { useState } from 'react';
import AgeSlider from './AgeSlider';
import Select from './Select';
import GenderSelection from './GenderSelection';
import './PersonaDetails.css';

function PersonaDetails() {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [ageRange, setAgeRange] = useState([18, 50]);
  const [gender, setGender] = useState('');

  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

  return (
    <div className="persona-details-container">
      <h2>Persona Details</h2>
      <div className="input-container">
        <AgeSlider onChange={handleAgeChange} />
        <Select onChange={handleCountyChange} />
        <GenderSelection onChange={handleGenderChange} />
      </div>
      <div className="selected-data">
        <p>Selected Age Range: {ageRange[0]} - {ageRange[1]}</p>
        <p>Selected County: {selectedCounty}</p>
        <p>Selected Gender: {gender}</p>
      </div>
    </div>
  );
}

export default PersonaDetails;
