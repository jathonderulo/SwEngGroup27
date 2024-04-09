import React, { useRef, useEffect, useState } from "react";
import "../styles/ChatWindow.css";

export default function ChatWindow({ messages, isLoading }) {
  const windowEnd = useRef(null);
  const [loadingText, setLoadingText] = useState(""); // Initializing without dots

  useEffect(() => {
    // Updates loadingText with 1 to 3 dots
    const intervalId = setInterval(() => {
      setLoadingText((prev) => prev.length < 3 ? prev + "." : ".");
    }, 500);

      // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    windowEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getMessageClasses(sender) {
    let baseClasses = "container-message";
    if (sender === "user") {
      return `${baseClasses} user-message`; // Additional class for user messages
    } else if (sender === "ai") {
      return `${baseClasses} ai-message`; // Additional class for AI messages
    }
    return baseClasses; // Default class if sender is unknown
  }

  return (
      <div className="container-chat">
        {messages.map((message, index) => (
            <div key={index} className={getMessageClasses(message.sender)}>
              <p style={{ whiteSpace: "pre-line" }}>{message.text}</p>
            </div>
        ))}
        {isLoading && (
            <div className={getMessageClasses("ai") + " loading"}>
              <p>{loadingText}</p>
            </div>
        )}
        <div ref={windowEnd} />
      </div>
  );
}
