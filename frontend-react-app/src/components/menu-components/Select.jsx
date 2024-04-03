import { useState} from 'react';
import '../../styles/Select.css';

function Select(){
    const [countries, setCountries] = useState('D');

    const irishCounties = [
      { label: 'Dublin', value: 'D'},
      { label: 'Leinster', value: 'L'},
      { label: 'Munster', value: 'M'},
      { label: 'Connacht', value: 'C'},
      { label: 'Ulster (ROI Only)', value: 'U'}
  ];

      
      return (
        <div>
        <select 
          className="selected-country" 
          value={countries} 
          onChange={(e) => setCountries(e.target.value)}
        >
          <option value=""></option>
          {irishCounties.map(county => (
            <option key={county.value} value={county.value}>
              {county.label}
            </option>
          ))}
        </select>
    </div>
      );
    
}

export default Select;