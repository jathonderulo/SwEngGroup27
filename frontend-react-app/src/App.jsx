import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";
import "./styles/index.css";

const InputOutputBox = () => {
  const [messages, setMessages] = useState([]); // Store messages received from the server

  const handleMessageSubmit = async (newMessage) => {
    // Add the new message to the chat window immediately
    setMessages([...messages, newMessage]);

    try {
      const requestBody = {
        message: newMessage.text,
        conversationHistory: messages.map(msg => msg.text) // Include the conversation history in the request
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
      // Add the response message to the chat window
      setMessages([...messages, { id: data.id, sender: "Server", text: data.message }]);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Display error message in the chat window
      setMessages([...messages, { id: Date.now(), sender: "System", text: 'Error: Unable to fetch data from the server' }]);
    }
  };

  return (
    <body>
      <ChatWindow messages={messages} />
      <ChatInput onSubmit={handleMessageSubmit} />
    </body>
  );
};

export default InputOutputBox;
