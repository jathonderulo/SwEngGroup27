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
      console.log("Thread Created.")
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

  useEffect(() => { //If console gives error here run "npm update openai"
    const eventSource = new EventSource('http://localhost:3001/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // If it's the start of a new message, reset the current response
      if (data.type === 'textDelta' && data.value.startsWith('...')) { // Assuming '...' denotes the start of a response
        setMessages((prevMessages) => [...prevMessages, { text: '', sender: "ai" }]);
      }
  
      // If it's part of an ongoing message, append it
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const lastMessage = newMessages[newMessages.length - 1];

        if (lastMessage && lastMessage.sender === 'ai') {
          if(data.status == 'open') {   // This status is used to prevent mysterious repeated chunks
            lastMessage.text += data.value;
            data.status = 'closed';
          }
        } else {
          newMessages.push({ text: data.value, sender: "ai" });
        }
        return newMessages;
      });
    };
    
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      return () => eventSource.close();
    };
    return () => eventSource.close();
  }, []);
  

  const handleMessageSubmit = (newMessageText) => {
    const newUserMessage = {
      text: newMessageText.text,
      sender: "user"
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(false);

    if (!threadID) {
      console.error("ThreadID is not initialized yet.");
      setIsLoading(false);
      return;
    }

    console.log("User req sent.");
    fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newUserMessage.text, threadID }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error sending message:', error);
      setIsLoading(false);
    });
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
