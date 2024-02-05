import { useState } from 'react';
import "./index.css";

const TextBoxApp = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [textareaHeight, setTextareaHeight] = useState(1); 

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    const height = e.target.scrollHeight; 
    const rowHeight = 15; 
    const trows = Math.ceil(height / rowHeight) - 1; 
    
    if (trows > textareaHeight) { 
      setTextareaHeight(trows); 
    } else if(inputText === ''){
      setTextareaHeight(1);
    }
  };

  const handleDisplayClick = () => {
    setDisplayText(inputText);
    setInputText('');
  };


  return (
    <div className='container'>
      <div className="output">
        <textarea value={displayText} readOnly className="output-box"/>
      </div>  
      <div className="input">
        <textarea
          type="text" 
          value={inputText} 
          onChange={handleInputChange} 
          placeholder='Type here...'
          className="input-box"
          rows={textareaHeight}
        />
        <button onClick={handleDisplayClick} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default TextBoxApp;