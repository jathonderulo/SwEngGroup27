import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";
import AiAvatar from "./components/AiAvatar.jsx";
import "./styles/index.css";
import "./styles/background.css";  
import axios from 'axios';

const InputOutputBox = () => {
  const [messages, setMessages] = useState([]);
  const [threadID, setThreadID] = useState(null); // State to store the dynamic threadID
  const [isLoading, setIsLoading] = useState(false); //state of the loading message

  useEffect(() => {
    // Function to initialize a new thread
    const initNewThread = async () => {
      try {
        const response = await axios.post('http://localhost:3001/new-thread');
        setThreadID(response.data.threadID); // Store the threadID from the response
      } catch (error) {
        console.error('Error initializing new thread:', error);
      }
    };

    initNewThread();
  }, []);

  const handleMessageSubmit = async (newMessageText) => {
    // Construct a new message object for the user message
    const newUserMessage = {
      text: newMessageText.text,
      sender: "user" // message is from the user
    };
  
    // Add the new user message to the chat window immediately
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true); // Show loading indicator
  
    if (!threadID) {
      console.error("ThreadID is not initialized yet.");
      setIsLoading(false);
      return;
    }
  
    try {
      const requestBody = {
        message: newMessageText.text,
        threadID,
      };
  
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setIsLoading(false); // Hide loading indicator
  
      // Construct a new message object for the AI response
      const newAiMessage = {
        text: data.message,
        sender: "ai" // Indicating this message is from the AI
      };
  
      // Add the AI response to the chat window
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };
  
  

  return (
    <body>
      <div className="main-container"></div>
        <div className="container-page">
        <ChatWindow messages={messages} isLoading={isLoading}/>
        <AiAvatar />
      </div>
        <ChatInput onSubmit={handleMessageSubmit} />
    </body>
  );
};

export default InputOutputBox;
