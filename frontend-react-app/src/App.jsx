import { useState, useEffect, useRef } from 'react';
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";
import "./styles/index.css";

const InputOutputBox = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]); // Store conversation history
  const textAreaRef = useRef(null);
  const [messages, setMessages] = useState([]);


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

  function handleMessageSubmit(newMessage) {
    setMessages([...messages, newMessage]);
  }

// no text areas
  return (
    <body>
      <div className='header'>header</div>
      <ChatWindow messages={messages} />
      <ChatInput onSubmit={handleMessageSubmit} />
    </body>
  );
};

export default InputOutputBox;
