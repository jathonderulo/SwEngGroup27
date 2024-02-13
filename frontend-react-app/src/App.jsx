import { useState, useEffect, useRef } from 'react';
import "./index.css";

const InputOutputBox = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]); // Store conversation history
  const textAreaRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    try {
      const requestBody = {
        message: inputText,
        conversationHistory: conversationHistory // Include the conversation history in the request
      };

      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDisplayText(prev => prev + '\n' + data.message); // Append new message to the display
      setConversationHistory(data.conversationHistory); // Update the conversation history

    } catch (error) {
      console.error('Error fetching data:', error);
      setDisplayText('Error: Unable to fetch data from the server');
    }

    setInputText(''); // Clear input field
  };

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(resizeTextArea, [inputText]);

  return (
    <body>
      <div className='header'>header</div>
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
            rows={1}
            ref={textAreaRef}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} className="send-button">Send </button>
          
        </div>
      </div>
    </body>
  );
};

export default InputOutputBox;
