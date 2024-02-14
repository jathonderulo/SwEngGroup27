import { useState, useEffect, useRef } from 'react';
import ChatHistory from "./components/ChatHistory";
import "./index.css";

const InputOutputBox = () => {
  const [inputText, setInputText] = useState('');
  // const [displayText, setDisplayText] = useState('');
  const [messages, setMessages] = useState([]);
  const textAreaRef = useRef(null); 

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleDisplay = () => {
    // setDisplayText(inputText);
    const newMessage = {
      id: crypto.randomUUID(),
      sender: "User",
      text: inputText
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDisplay();
    }
  };

  useEffect(resizeTextArea, [inputText]);

  return (
    <body>
      <div className='header'>header</div>
      <div className='container'>
        {/* <div className="output">
          <textarea value={displayText} readOnly className="output-box"/>
        </div>   */}
        <ChatHistory messages={messages} />
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
          <button onClick={handleDisplay} className="send-button">Send </button>
          
        </div>
      </div>
    </body>
  );
};

export default InputOutputBox;
