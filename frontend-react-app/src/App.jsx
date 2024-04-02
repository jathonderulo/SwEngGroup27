import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";
import AiAvatar from "./components/AiAvatar.jsx";
import "./styles/index.css";
import "./styles/background.css";  


const InputOutputBox = () => {
  const [messages, setMessages] = useState([]);
  const [threadID, setThreadID] = useState(null);
  // State to control the loading indicator visibility. Initially, no loading is happening
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

  useEffect(() => { //If console gives error here run "npm update openai"
    const eventSource = new EventSource('http://localhost:3001/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Logic handling incoming messages. If isLoading is true, it's set to false, indicating loading has finished.
      if (data.type === 'textDelta') {
        if (isLoading) {
          setIsLoading(false); // Turns off loading indicator once data is received
        }

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          let lastMessage = newMessages[newMessages.length - 1];

          if (lastMessage && lastMessage.sender === 'ai') {
            if(data.status === 'open') {
              lastMessage.text += data.value;
              data.status = 'closed';
            }
          } else {
            newMessages.push({ text: data.value, sender: "ai" });
          }

          return newMessages;
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      setIsLoading(false); // Turns off loading indicator in case of an error
      eventSource.close();
    };

    return () => eventSource.close();
  }, [isLoading]);
  

  const handleMessageSubmit = async (newMessageText) => {
    const newUserMessage = {
      text: newMessageText.text,
      sender: "user"
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);  // Turns on the loading dots when a new message is submitted

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
      // Finally block to ensure the loading indicator is turned off after the attempt to send a message
    } finally {
      setIsLoading(false); // Stop loading when the response is received or there is an error
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
