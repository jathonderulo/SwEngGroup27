import { useState } from 'react';
import ReactSlider from 'react-slider';
import '../../styles/Slider.css';

function AgeSlider() {
    const [ageRange, setAgeRange] = useState([18, 50]);

    const handleSliderChange = (value) => {
      setAgeRange(value);
    };
  
    const handleMinInputChange = (event) => {
      const newValue = Math.max(0, Math.min(parseInt(event.target.value, 10), ageRange[1]));
      setAgeRange([newValue, ageRange[1]]);
    };
  
    const handleMaxInputChange = (event) => {
      const newValue = Math.min(100, Math.max(parseInt(event.target.value, 10), ageRange[0]));
      setAgeRange([ageRange[0], newValue]);
    };

  
    return (
      <div className="age-slider-container">
        <ReactSlider
          value={ageRange}
          onChange={handleSliderChange}
          className="slider"
          thumbClassName="thumb"
          trackClassName="track"
          withTracks
          min={0}
          max={100}
          ariaLabel={['Lower thumb', 'Upper thumb']}
          ariaValuetext={(state) => `Age range: ${state.value[0]} to ${state.value[1]}`}
        />
        <div className="age-display">
          <input
            type="number"
            value={ageRange[0]}
            onChange={handleMinInputChange}
            min={0}
            max={ageRange[1]} 
          />
          <input
            type="number"
            value={ageRange[1]}
            onChange={handleMaxInputChange}
            min={ageRange[0]}
            max={100}
          />

        </div>
      </div>
  );
}

export default AgeSlider;
