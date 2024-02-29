import React, { useRef, useEffect, useState } from "react";
import "../styles/ChatWindow.css";


export default function ChatWindow({ messages, isLoading  }) {
  const windowEnd = useRef(null);
  const [loadingText, setLoadingText] = useState("...");

  /** Show loading dots */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "...") return "..";
        else if (prev === "..") return ".";
        else return "...";
      });
    }, 300);

    return () => clearInterval(intervalId);
  }, []);
  /** Scroll to bottom on message submit */
  useEffect(() => {
    windowEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    /** Calculate the width of the text */
    function getTextWidth(text) {
      // Assuming 10 pixels per character for simplicity
      return text.length * 10;
    }

  return (
    <div className="container-chat">
      {messages &&
        messages.map((message) => (
          <div className="container-message"
          key={message.id}
          style={{ width: getTextWidth(message.text) > 300 ? "95%" : "auto" }}
          >
          <p style={{ whiteSpace: "pre-line" }}>{message.text}</p> {/*if the message goes to the new line, the new line will show in the chat window*/}
          </div>
        ))}
      {isLoading && (
        <div className="container-message loading">
          <div className="message-box">
            <p>{loadingText}</p>
          </div>
        </div>
      )}
      <div ref={windowEnd} />
    </div>
  );
}