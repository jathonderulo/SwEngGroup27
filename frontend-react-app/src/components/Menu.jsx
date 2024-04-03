import {useState } from "react";
import "../styles/Menu.css";

import settIcon from '../imgs/setting.png';
import AgeSlider from "./menu-components/Slider";
import GenderSelection from "./menu-components/Radio.jsx";
import Select from "./menu-components/Select.jsx";

/* to do next:
sending data
*/

function Menu() {
    const [open, setOpen] = useState(false);

    const handleDropdown = () => setOpen(!open);
  
    return (
        <div className="menu-container">
          <button className="sett-button" onClick={handleDropdown}>Settings <img src={settIcon} className="sett-icon"/></button>
          {open && <DropdownMenu onClose={handleDropdown} />}
        </div>
  );
}

function DropdownMenu({ onClose }) {

  const handleSend = async () => {
    // POST request to send persona info to the backend, where it is is parsed into indexes
    // for selecting the correct fileID from a 3D array.
    // Check console logs in backend terminal to see what values are received on the backend from
    // this request
    fetch('http://localhost:3001/persona-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },             // Just return the ageRangeIndex from 0-3 inclusive if that is easier
      body: JSON.stringify({ gender: 'PlaceHolder', ageIndex: 'PlaceHolder', county: 'PlaceHolder'}),
    });

    onClose();
  };

  return (
    <div className="dropdown">
        <div className="menu">
            <div className="menu-age">
                <label htmlFor="age" className="item-label">Select Age Range</label>
                <AgeSlider id="age"/>
            </div>  
            <div className="menu-gender">
                <label htmlFor="gender" className="item-label">Select Gender</label>
                <GenderSelection id="gender"/>
            </div>   
            <div className="menu-nationality">
                <label htmlFor="country" className="item-label">Select a Region</label>
                <Select id="country"/>
            </div>   
            <button className="menu-button" onClick={handleSend}>Save</button>
        </div>
    </div>
  );
}

export default Menu;