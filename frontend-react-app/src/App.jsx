import { useState, useEffect, useRef } from 'react';
import "./index.css";

const InputOutputBox = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [threadID, setThreadID] = useState('');           // threadID used to seperate different user's conversation
  const textAreaRef = useRef(null);

  // This function sends a get request to the backend, which results in a new
  // thread being created. This new thread's ID is then returned to this functon
  // where it is assigned to the threadID variable
  const getThread = async () => {
    try {
      const response = await fetch('http://localhost:3001/new-thread',);  // Sends the GET request
      const data = await response.json();                 // Retrieve JSON from the response
      setThreadID(data.threadID);                         // Set threadID to the threadID string
    } catch (error) {
      console.error('Error creating thread: ', error);    //  Catch and log errors
    }
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    try {
      const requestBody = {
        message: inputText,
        threadID: threadID,                               // threadID is included in req.body
      };

      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDisplayText(prev => prev + '\n' + data.message); // Append new message to the display

    } catch (error) {
      console.error('Error fetching data:', error);
      setDisplayText('Error: Unable to fetch data from the server');
    }

    setInputText('');                                     // Clear input field
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

  
  // Check if threadID is yet to be set
  if(threadID === '') {
    getThread();                                          // If so, set it to the ID of a new thread
  }

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