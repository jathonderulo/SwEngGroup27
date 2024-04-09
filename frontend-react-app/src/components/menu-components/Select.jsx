import { useState} from 'react';
import '../../styles/Select.css';

function Select(){
    const [counties, setCounties] = useState('A');

    const irishCounties = [
      { label: 'Any', value: 'A'},
      { label: 'Dublin', value: 'D'},
      { label: 'Leinster', value: 'L'},
      { label: 'Munster', value: 'M'},
      { label: 'Connacht', value: 'C'},
      { label: 'Ulster (ROI Only)', value: 'U'}
  ];

      
      return (
        <div>
        <select 
          name="county"
          className="selected-county" 
          value={counties} 
          onChange={(e) => setCounties(e.target.value)}
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