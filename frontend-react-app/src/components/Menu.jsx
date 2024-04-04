import React, { useState } from "react";
import "../styles/Menu.css";

import settIcon from '../imgs/setting.png';
import AgeSlider from "./menu-components/Slider";
import GenderSelection from "./menu-components/Radio.jsx";
import Select from "./menu-components/Select.jsx";

function Menu({ onSave }) {
    const [open, setOpen] = useState(false);
    const [gender, setGender] = useState(""); // State to store selected gender
    const [ageRange, setAgeRange] = useState(""); // State to store selected age range
    const [country, setCountry] = useState(""); // State to store selected country

    const handleDropdown = () => setOpen(!open);

    const handleSend = () => {
        onSave({ gender, ageRange, country });
        setOpen(false); // Close the dropdown after saving
    };

    return (
        <div className="menu-container">
          <button className="sett-button" onClick={handleDropdown}>Settings <img src={settIcon} className="sett-icon"/></button>
          {open && <DropdownMenu onClose={handleDropdown} onSend={handleSend} setGender={setGender} setAgeRange={setAgeRange} setCountry={setCountry} />}
        </div>
  );
}

function DropdownMenu({ onClose, onSend, setGender, setAgeRange, setCountry }) {

    return (
        <div className="dropdown">
            <div className="menu">
                <div className="menu-age">
                    <label htmlFor="age" className="item-label">Select Age Range</label>
                    <AgeSlider id="age" onChange={setAgeRange} />
                </div>  
                <div className="menu-gender">
                    <label htmlFor="gender" className="item-label">Select Gender</label>
                    <GenderSelection id="gender" onChange={setGender} />
                </div>   
                <div className="menu-nationality">
                    <label htmlFor="country" className="item-label">Select a County</label>
                    <Select id="country" onChange={setCountry} />
                </div>   
                <button className="menu-button" onClick={onSend}>Save</button>
            </div>
        </div>
  );
}

export default Menu;
