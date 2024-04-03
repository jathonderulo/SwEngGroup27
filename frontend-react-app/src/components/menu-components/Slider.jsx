import { useState } from 'react';
import ReactSlider from 'react-slider';
import '../../styles/Slider.css';

function AgeSlider() {
  const ageRangeMap = [
    { min: 18, max: 22 },
    { min: 23, max: 35 },
    { min: 36, max: 53 },
    { min: 54, max: 65 }
  ];

  const [ageRangeIndex, setAgeRangeIndex] = useState(0); 

  const handleSliderChange = (value) => {
      setAgeRangeIndex(value);
      console.log(ageRangeMap[value].min, ageRangeMap[value].max);
  };
  
    return (
      <div className="age-slider-container">
        <ReactSlider
          className="slider"
          marks={ageRangeMap.map((_, index) => index)}
          markClassName="mark"
          min={0}
          max={ageRangeMap.length -1}
          value={ageRangeIndex}
          onChange={handleSliderChange}
          thumbClassName="thumb"
          trackClassName="track"
          
        />
        <div className='labels'>
          <div className="mark-label">18-22</div>
          <div className="mark-label">23-35</div>
          <div className="mark-label">36-53</div>
          <div className="mark-label">54-65</div> 
        </div>
      </div>
  );
}

export default AgeSlider;


