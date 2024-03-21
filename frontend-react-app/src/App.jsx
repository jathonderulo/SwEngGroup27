import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";
import AiAvatar from "./components/AiAvatar.jsx";
import "./styles/index.css";
import "./styles/background.css";  


const InputOutputBox = () => {
  const [messages, setMessages] = useState([]);
  const [threadID, setThreadID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Function to initialize a new thread
    const initNewThread = async () => {
      try {
        const response = await fetch('http://localhost:3001/new-thread', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setThreadID(data.threadID); // Store the threadID from the response
      } catch (error) {
        console.error('Error initializing new thread:', error);
      }
      
    };

    initNewThread();
  }, []);

  useEffect(() => { // If terminal gives error here run "npm update openai"
    // Set up an EventSource to listen for messages from the server
    const eventSource = new EventSource('http://localhost:3001/stream');
    console.log("Stream control running");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'textDelta') {
        setMessages((prevMessages) => [...prevMessages, { text: data.value, sender: "ai" }]); // Gives new box for every text, needs fix
      }
    };

    eventSource.onerror = () => {
      console.error('EventSource error.');
      eventSource.close();
      setIsLoading(false);
    };

    // Store the EventSource reference in the window object if you need to close it later
    window.currentEventSource = eventSource;

    // Clean up the EventSource when the component unmounts
    return () => eventSource.close();
  }, []);

  const handleMessageSubmit = async (newMessageText) => {
    const newUserMessage = {
      text: newMessageText.text,
      sender: "user"
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    if (!threadID) {
      console.error("ThreadID is not initialized yet.");
      setIsLoading(false);
      return;
    }

    try {
      // Send the user message to the server using a POST request
      await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newUserMessage.text, threadID }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
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
