import React, { useRef, useEffect } from "react";
import "../styles/ChatWindow.css";


export default function ChatWindow({ messages }) {
  const windowEnd = useRef(null);

  /** Scroll to bottom on message submit */
  useEffect(() => {
    windowEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Calculate the width of the chat message container */
  function calcWidth(message) {
    return message.text.length * 10;
  }

  return (
    <div className="container-chat">
      {messages &&
        messages.map((message) => (
          <div
            className="container-message"
            key={message.id}
            style={{ width: calcWidth(message) }}
          >
            <p>{message.text}</p>
          </div>
        ))}
      <div ref={windowEnd} />
    </div>
  );
}