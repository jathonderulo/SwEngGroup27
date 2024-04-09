import {useState } from "react";
import "../styles/Menu.css";

import settIcon from '../imgs/setting.png';
import AgeSlider from "./menu-components/Slider";
import GenderSelection from "./menu-components/Radio.jsx";
import Select from "./menu-components/Select.jsx";

/* to do next:
sending data
*/

function Menu({setAssistantID, setFileID}) {
    const [open, setOpen] = useState(false);

    const handleDropdown = () => setOpen(!open);

    return (
        <div className="menu-container">
            <button className="sett-button" onClick={handleDropdown}>Settings <img src={settIcon} className="sett-icon"/></button>
            {open && <DropdownMenu setAssistantID={setAssistantID} setFileID={setFileID} onClose={handleDropdown} />}
        </div>
    );
}

function DropdownMenu({ setFileID, onClose, setAssistantID }) {

    const handleSend = async (event) => {
        event.preventDefault(); // Prevent the form from causing a page reload

        const formData = new FormData(event.target);
        const gender = formData.get('gender');
        const ageIndex = formData.get('ageRangeIndex');
        const county = formData.get('county');

        // POST request to send persona info to the backend, where it is is parsed into indexes
        // for selecting the correct fileID from a 3D array.
        // Check console logs in backend terminal to see what values are received on the backend from
        // this request
        const response = await fetch('http://localhost:3001/persona-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gender: gender, ageIndex: ageIndex, county: county}),
        });
        const data = await response.json();
        setAssistantID(data.assistantID);      // Thes lines needs to call setAssistantID() in App.jsx,
        setFileID(data.fileID);                // but I don't know how to access that variable

        onClose();
    };
    // Reset filter states to their default values and send a reset request to the backend
    const handleReset = async () => {
        // Sends a POST request to the backend to reset the filters
        const response = await fetch('http://localhost:3001/reset-filters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setAssistantID(data.assistacoolntID);      // Thes lines needs to call setAssistantID() in App.jsx,
        setFileID(data.fileID);                // but I don't know how to access that variable

        onClose(); // Close the dropdown menu after reset
    };

    return (
        <div className="dropdown">
            <form onSubmit={handleSend} className="menu">
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
                <button type="submit" className="menu-button">Save</button>
                <button type="button" onClick={handleReset} className="menu-button">Reset Filters</button>
            </form>
        </div>
    );
}

export default Menu;