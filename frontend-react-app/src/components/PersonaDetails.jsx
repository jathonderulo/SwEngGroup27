import React, { useState } from 'react';
import AgeSlider from './AgeSlider';
import Select from './Select';
import GenderSelection from './GenderSelection';

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
    <div style={{ position: 'fixed', bottom: '0', right: '0', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <AgeSlider onChange={handleAgeChange} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Select onChange={handleCountyChange} />
      </div>
      <div>
        <GenderSelection onChange={handleGenderChange} />
      </div>
      <div style={{ position: 'fixed', bottom: '0', left: '0', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <p>Selected Age Range: {ageRange[0]} - {ageRange[1]}</p>
        <p>Selected County: {selectedCounty}</p>
        <p>Selected Gender: {gender}</p>
      </div>
    </div>
  );
}

export default PersonaDetails;
