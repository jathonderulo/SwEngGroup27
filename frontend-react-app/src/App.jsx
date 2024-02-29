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

  const handleMessageSubmit = async (newMessage) => {
    // Add the new message to the chat window immediately
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true); // three loading dots start now
    if (!threadID) {
      console.error("ThreadID is not initialized yet.");
      return; // Prevent the chat request if threadID is not set
    }


    try {
      const requestBody = {
        message: newMessage.text,
        threadID,             // Dynamic threadID
      };

      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the response was not ok
      if (!response.ok) {
        const errorDetails = await response.text(); // or response.json() if the server sends JSON
        console.error(
          "Server responded with an error:",
          response.status,
          errorDetails
        );
        // Optionally, update the UI to show the error
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now(), sender: "System", text: `Error: ${errorDetails}` },
        ]);
        return; // Prevent further execution
      }

      const data = await response.json();
      setIsLoading(false); //end loading dots before adding response to the window
      // Add the response message to the chat window
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: data.id, sender: "Server", text: data.message },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Display error message in the chat window
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          sender: "System",
          text: "Error: Unable to fetch data from the server",
        },
      ]);
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
