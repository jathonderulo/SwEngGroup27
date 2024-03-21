import { useState } from 'react';
import '../../styles/Radio.css';

function GenderSelection() {
    const [gender, setGender] = useState('');
  
    const handleGenderChange = (event) => {
      setGender(event.target.value);
    };
  
    return (
      <div className='gender-selection'>
        <input
          id="male"
          type="radio"
          name="gender"
          value="male"
          checked={gender === 'male'}
          onChange={handleGenderChange}
          className="gender-radio"
        />
        <label htmlFor="male" className="gender-label">Male</label>

        <input
          id="female"
          type="radio"
          name="gender"
          value="female"
          checked={gender === 'female'}
          onChange={handleGenderChange}
          className="gender-radio"
        />
        <label htmlFor="female" className="gender-label">Female</label>
      </div>
    );
  }
  
  export default GenderSelection;