import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";
import AiAvatar from "./components/AiAvatar.jsx";
import "./styles/index.css";

const InputOutputBox = () => {
  const [messages, setMessages] = useState([]); // Store messages received from the server

  const handleMessageSubmit = async (newMessage) => {
    // Add the new message to the chat window immediately
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const requestBody = {
        message: newMessage.text,
        conversationHistory: messages.map((msg) => ({
          role: msg.sender === "Server" ? "assistant" : "user", // Adjust this based on your actual roles
          content: msg.text,
        })),
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
      <div className="container-page">
        <ChatWindow messages={messages} />
        <AiAvatar />
      </div>
        <ChatInput onSubmit={handleMessageSubmit} />
    </body>
  );
};

export default InputOutputBox;
