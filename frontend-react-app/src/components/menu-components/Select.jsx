import { useState, useEffect } from 'react';
import '../../styles/Select.css';

function Select(){
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchCountries = async () => {
          setLoading(true);
          try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) {
              throw new Error('Failed to fetch countries');
            }
            const data = await response.json();
            const countryOptions = data.map(country => ({
              label: country.name.common, 
              value: country.cca2, 
            }))
            .sort((a, b) => a.label.localeCompare(b.label)); // Sort countries alphabetically
      
            setCountries(countryOptions);
          } catch (error) {
            console.error("Error fetching countries:", error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchCountries();
      }, []);
      
      return (
        <div>
          {loading ? (
            <p className='loading'>Loading countries...</p>
          ) : (
            <select className="selected-country" defaultValue="">
              <option value=""> </option>
              {countries.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          )}
        </div>
      );
    
}

export default Select;