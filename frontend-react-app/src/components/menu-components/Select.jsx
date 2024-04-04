import { useState} from 'react';
import '../../styles/Select.css';

function Select(){
    const [countries, setCountries] = useState('');

    const irishCounties = [
      { label: 'Carlow', value: 'CW' },
      { label: 'Cavan', value: 'CN' },
      { label: 'Clare', value: 'CE' },
      { label: 'Cork', value: 'CO' },
      { label: 'Donegal', value: 'DL' },
      { label: 'Dublin', value: 'D' },
      { label: 'Galway', value: 'G' },
      { label: 'Kerry', value: 'KY' },
      { label: 'Kildare', value: 'KE' },
      { label: 'Kilkenny', value: 'KK' },
      { label: 'Laois', value: 'LS' },
      { label: 'Leitrim', value: 'LM' },
      { label: 'Limerick', value: 'LK' },
      { label: 'Longford', value: 'LD' },
      { label: 'Louth', value: 'LH' },
      { label: 'Mayo', value: 'MO' },
      { label: 'Meath', value: 'MH' },
      { label: 'Monaghan', value: 'MN' },
      { label: 'Offaly', value: 'OY' },
      { label: 'Roscommon', value: 'RN' },
      { label: 'Sligo', value: 'SO' },
      { label: 'Tipperary', value: 'TA' },
      { label: 'Waterford', value: 'WD' },
      { label: 'Westmeath', value: 'WH' },
      { label: 'Wexford', value: 'WX' },
      { label: 'Wicklow', value: 'WW' }
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